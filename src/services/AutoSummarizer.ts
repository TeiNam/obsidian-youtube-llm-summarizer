import { t } from "../i18n";
import { ChannelVideos, PluginSettings, SummaryStage, VideoItem } from "../models/types";
import { resolveChannelSaveFolderPath } from "../views/FeedView";
import { getAiConfigurationError } from "./AiModelClient";
import type { SummarizerService } from "./SummarizerService";

/** 업로드 후 자동 자막이 만들어지기를 기다리는 시간 */
export const AUTO_SUMMARY_DELAY_MS = 24 * 60 * 60 * 1000;
/** 채널 점검 주기: 하루에 한 번만 조회한다 */
export const AUTO_SUMMARY_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;
/** 점검할 때가 됐는지 확인하는 타이머 주기 (네트워크 요청 없음) */
export const AUTO_SUMMARY_TIMER_MS = 60 * 60 * 1000;

/** 이 단계에 들어서면 모델을 호출해 비용이 발생한다 */
const MODEL_STAGES: string[] = [SummaryStage.TRANSLATING, SummaryStage.SUMMARIZING];

export interface AutoSummarizerDependencies {
  getSettings(): PluginSettings;
  fetchVideos(settings: PluginSettings): Promise<ChannelVideos[]>;
  createService(saveFolderPath: string): Pick<SummarizerService, "summarize">;
  markSummarized(videoId: string): Promise<void>;
  /** 점검을 마친 시각을 저장한다. Obsidian을 다시 켜도 하루 한 번만 점검하기 위함 */
  markChecked(checkedAt: string): Promise<void>;
  notify(message: string): void;
}

/** 자동 요약 대상: 자동 요약을 켠 뒤 올라왔고, 업로드 후 하루가 지났으며, 아직 요약하지 않은 영상 */
export function selectAutoSummaryVideos(
  channelVideos: ChannelVideos[],
  settings: PluginSettings,
  now: number
): VideoItem[] {
  const summarized = new Set(settings.summarizedVideoIds);
  return channelVideos.flatMap((group) => {
    const enabledSince = settings.monitoredChannels
      .find((channel) => channel.channelId === group.channelId)?.autoSummarizeSince;
    if (!enabledSince) return [];
    const enabledAt = Date.parse(enabledSince);
    return group.videos.filter((video) => {
      const publishedAt = Date.parse(video.publishedAt);
      return publishedAt >= enabledAt
        && now - publishedAt >= AUTO_SUMMARY_DELAY_MS
        && !summarized.has(video.videoId);
    });
  });
}

/** 자동 요약을 켠 채널의 새 영상을 하루에 한 번 점검해 요약 노트로 만든다 */
export class AutoSummarizer {
  private isRunning = false;
  /**
   * 모델 호출까지 간 뒤 실패한 영상. 다시 시도하면 비용이 또 들기 때문에 건너뛴다.
   * shortcut: 메모리에만 두므로 Obsidian을 다시 켜면 다음 점검에서 한 번 더 시도한다, 반복 과금이 문제되면 설정에 저장한다.
   */
  private modelFailures = new Set<string>();

  constructor(private deps: AutoSummarizerDependencies) {}

  async run(): Promise<void> {
    if (this.isRunning) return;
    const settings = this.deps.getSettings();
    const channels = settings.monitoredChannels.filter((channel) => channel.autoSummarizeSince);
    if (!channels.length || !settings.youtubeDataApiKey.trim() || getAiConfigurationError(settings)) return;
    const now = Date.now();
    const checkedAt = Date.parse(settings.autoSummaryCheckedAt);
    if (now - checkedAt < AUTO_SUMMARY_CHECK_INTERVAL_MS) return;

    this.isRunning = true;
    try {
      const fetched = await this.deps.fetchVideos({ ...settings, monitoredChannels: channels });
      for (const video of selectAutoSummaryVideos(fetched, settings, now)) {
        // 점검 도중 사용자가 직접 요약한 영상은 건너뛴다.
        if (this.modelFailures.has(video.videoId) || this.deps.getSettings().summarizedVideoIds.includes(video.videoId)) continue;
        await this.summarize(video, settings);
      }
      await this.deps.markChecked(new Date(now).toISOString());
    } finally {
      this.isRunning = false;
    }
  }

  private async summarize(video: VideoItem, settings: PluginSettings): Promise<void> {
    const tr = t(settings.language);
    let hasCalledModel = false;
    try {
      const folder = resolveChannelSaveFolderPath(
        settings.monitoredChannels, video.channelId, settings.subscriptionSaveFolderPath
      );
      await this.deps.createService(folder).summarize(
        `https://www.youtube.com/watch?v=${video.videoId}`,
        settings.summaryLanguage,
        (stage) => {
          if (MODEL_STAGES.includes(stage)) hasCalledModel = true;
        },
        undefined,
        video.publishedAt
      );
      await this.deps.markSummarized(video.videoId);
      this.deps.notify(tr.noticeAutoSummarized(video.title));
    } catch (error) {
      // 자막이 아직 없는 경우처럼 모델 호출 전 실패는 실패로 보지 않고 다음 날 점검 때 다시 시도한다.
      if (!hasCalledModel) return;
      this.modelFailures.add(video.videoId);
      const reason = error instanceof Error ? error.message : tr.feedSummaryError;
      this.deps.notify(tr.noticeAutoSummaryFailed(video.title, reason));
    }
  }
}
