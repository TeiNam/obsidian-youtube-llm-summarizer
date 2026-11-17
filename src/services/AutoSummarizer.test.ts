import { describe, it, expect, vi } from "vitest";
import { t } from "../i18n";
import { ChannelVideos, DEFAULT_SETTINGS, PluginSettings, SummaryStage, VideoItem } from "../models/types";
import { AUTO_SUMMARY_DELAY_MS, AutoSummarizer, AutoSummarizerDependencies, selectAutoSummaryVideos } from "./AutoSummarizer";

const NOW = Date.parse("2026-11-20T00:00:00Z");
const ENABLED_AT = "2026-11-10T00:00:00Z";
const hoursAgo = (hours: number): string => new Date(NOW - hours * 60 * 60 * 1000).toISOString();
const video = (videoId: string, publishedAt: string, channelId = "UC1"): VideoItem =>
  ({ videoId, title: `제목 ${videoId}`, channelId, channelTitle: channelId, publishedAt, thumbnailUrl: "" });
const channel = (channelId: string, autoSummarizeSince?: string) =>
  ({ channelId, channelTitle: channelId, thumbnailUrl: "", autoSummarizeSince });
const feed = (channelId: string, videos: VideoItem[]): ChannelVideos => ({ channelId, channelTitle: channelId, videos });

const SETTINGS: PluginSettings = {
  ...DEFAULT_SETTINGS,
  language: "ko",
  bedrockBearerToken: "token",
  youtubeDataApiKey: "data-key",
  subscriptionSaveFolderPath: "구독",
  monitoredChannels: [{ ...channel("UC1", ENABLED_AT), saveFolderPath: "채널폴더" }, channel("UC2")],
  summarizedVideoIds: ["done"],
};

describe("selectAutoSummaryVideos", () => {
  it("자동 요약을 켠 뒤 올라와 하루가 지났고 아직 요약하지 않은 영상만 고른다", () => {
    const picked = selectAutoSummaryVideos([
      feed("UC1", [
        video("ready", hoursAgo(25)),
        video("exactly-one-day", new Date(NOW - AUTO_SUMMARY_DELAY_MS).toISOString()),
        video("too-new", hoursAgo(23)),
        video("before-enable", "2026-11-09T23:59:59Z"),
        video("done", hoursAgo(48)),
        video("bad-date", "날짜 아님"),
      ]),
      feed("UC2", [video("toggle-off", hoursAgo(48), "UC2")]),
    ], SETTINGS, NOW);
    expect(picked.map((item) => item.videoId)).toEqual(["ready", "exactly-one-day"]);
  });
});

describe("AutoSummarizer", () => {
  type Summarize = AutoSummarizerDependencies["createService"] extends (path: string) => { summarize: infer Fn } ? Fn : never;

  function setup(summarize: unknown, settings: PluginSettings = SETTINGS) {
    let current = settings;
    const deps = {
      getSettings: () => current,
      fetchVideos: vi.fn(async (_settings: PluginSettings) => [feed("UC1", [video("ready", "2026-11-11T00:00:00Z")])]),
      createService: vi.fn((_saveFolderPath: string) => ({ summarize: summarize as Summarize })),
      markSummarized: vi.fn(async (videoId: string) => {
        current = { ...current, summarizedVideoIds: [...current.summarizedVideoIds, videoId] };
      }),
      markChecked: vi.fn(async (checkedAt: string) => {
        current = { ...current, autoSummaryCheckedAt: checkedAt };
      }),
      notify: vi.fn(),
    };
    /** 다음 날 점검 시점이 된 것처럼 마지막 점검 시각을 하루 전으로 돌린다 */
    const nextDay = (): void => {
      current = { ...current, autoSummaryCheckedAt: new Date(Date.now() - AUTO_SUMMARY_DELAY_MS).toISOString() };
    };
    return { deps, auto: new AutoSummarizer(deps), nextDay };
  }

  it("대상 영상을 채널 폴더에 요약하고 완료로 기록한 뒤 알린다", async () => {
    const summarize = vi.fn().mockResolvedValue({});
    const { deps, auto } = setup(summarize);
    await auto.run();
    // 자동 요약을 켠 채널만 조회한다.
    expect(deps.fetchVideos.mock.calls[0][0].monitoredChannels.map((item) => item.channelId)).toEqual(["UC1"]);
    expect(deps.createService).toHaveBeenCalledWith("채널폴더");
    expect(summarize).toHaveBeenCalledWith(
      "https://www.youtube.com/watch?v=ready", "ko", expect.any(Function), undefined, "2026-11-11T00:00:00Z"
    );
    expect(deps.markSummarized).toHaveBeenCalledWith("ready");
    expect(deps.notify).toHaveBeenCalledWith(t("ko").noticeAutoSummarized("제목 ready"));
  });

  it("채널 점검은 하루에 한 번만 한다", async () => {
    const { deps, auto, nextDay } = setup(vi.fn().mockResolvedValue({}));
    await auto.run();
    expect(deps.markChecked).toHaveBeenCalledOnce();
    // 같은 날에는 타이머가 다시 불러도, Obsidian을 다시 켜도(새 인스턴스) 조회하지 않는다.
    await auto.run();
    await new AutoSummarizer(deps).run();
    expect(deps.fetchVideos).toHaveBeenCalledOnce();
    nextDay();
    await auto.run();
    expect(deps.fetchVideos).toHaveBeenCalledTimes(2);
  });

  it("하루가 지나도 자막이 없으면 실패로 알리지 않고 다음 날 점검 때 다시 시도한다", async () => {
    const summarize = vi.fn().mockRejectedValueOnce(new Error("자막 없음")).mockResolvedValue({});
    const { deps, auto, nextDay } = setup(summarize);
    await auto.run();
    expect(deps.markSummarized).not.toHaveBeenCalled();
    expect(deps.notify).not.toHaveBeenCalled();
    await auto.run();
    expect(summarize).toHaveBeenCalledOnce();
    nextDay();
    await auto.run();
    expect(summarize).toHaveBeenCalledTimes(2);
    expect(deps.markSummarized).toHaveBeenCalledWith("ready");
  });

  it("모델 호출까지 간 뒤 실패한 영상은 알리고, 비용이 반복되지 않게 다시 시도하지 않는다", async () => {
    const summarize = vi.fn(async (_url: string, _language: string, onProgress: (stage: string) => void) => {
      onProgress(SummaryStage.SUMMARIZING);
      throw new Error("응답 잘림");
    });
    const { deps, auto, nextDay } = setup(summarize);
    await auto.run();
    nextDay();
    await auto.run();
    expect(summarize).toHaveBeenCalledOnce();
    expect(deps.notify).toHaveBeenCalledExactlyOnceWith(t("ko").noticeAutoSummaryFailed("제목 ready", "응답 잘림"));
  });

  it("자동 요약을 켠 채널이 없거나 요약할 수 없는 설정이면 아무 요청도 하지 않는다", async () => {
    for (const settings of [
      { ...SETTINGS, monitoredChannels: [channel("UC2")] },
      { ...SETTINGS, youtubeDataApiKey: " " },
      { ...SETTINGS, bedrockBearerToken: "" },
    ]) {
      const { deps, auto } = setup(vi.fn(), settings);
      await auto.run();
      expect(deps.fetchVideos).not.toHaveBeenCalled();
    }
  });
});
