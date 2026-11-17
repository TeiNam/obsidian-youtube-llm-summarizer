// ============================================================
// SubscriptionManager 단위 테스트
// 모니터링 대상 채널의 최신 영상 조회 및 관리 로직 검증
// YouTubeDataApiClient를 vi.fn()으로 모킹하여 테스트
// ============================================================

import { describe, it, expect, vi } from "vitest";
import { SubscriptionManager } from "./SubscriptionManager";
import { YouTubeDataApiError } from "./YouTubeDataApiClient";
import type { YouTubeDataApiClient } from "./YouTubeDataApiClient";
import type { PluginSettings, VideoItem } from "../models/types";
import { DEFAULT_SETTINGS } from "../models/types";

/**
 * 모킹된 YouTubeDataApiClient 생성 헬퍼
 */
function createMockApiClient(): {
  fetchChannelInfo: ReturnType<typeof vi.fn>;
  fetchRecentVideos: ReturnType<typeof vi.fn>;
} & YouTubeDataApiClient {
  return {
    fetchChannelInfo: vi.fn(),
    fetchRecentVideos: vi.fn(),
  } as unknown as YouTubeDataApiClient & {
    fetchChannelInfo: ReturnType<typeof vi.fn>;
    fetchRecentVideos: ReturnType<typeof vi.fn>;
  };
}

/**
 * 재생목록 ID별 응답을 지정한다. 값이 Error면 그 오류를 던진다.
 * 지정하지 않은 재생목록은 실제 API처럼 404(재생목록 없음)로 응답한다 — 쇼츠가 없는 채널의 "UUSH…" 재생목록이 이 경우다.
 */
function mockPlaylists(
  mockClient: { fetchRecentVideos: ReturnType<typeof vi.fn> },
  playlists: Record<string, VideoItem[] | Error>
): void {
  mockClient.fetchRecentVideos.mockImplementation(async (playlistId: string) => {
    const response = playlists[playlistId] ?? new YouTubeDataApiError("playlistNotFound", 404);
    if (response instanceof Error) throw response;
    return { items: response, nextPageToken: null };
  });
}

/**
 * 테스트용 PluginSettings 생성 헬퍼
 */
function createTestSettings(overrides?: Partial<PluginSettings>): PluginSettings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

/**
 * 테스트용 VideoItem 생성 헬퍼
 */
function createVideoItem(overrides?: Partial<VideoItem>): VideoItem {
  return {
    videoId: "vid_001",
    title: "테스트 영상",
    channelId: "UC_ch_1",
    channelTitle: "테스트 채널",
    publishedAt: "2024-06-15T10:00:00Z",
    thumbnailUrl: "https://example.com/thumb.jpg",
    ...overrides,
  };
}

describe("SubscriptionManager", () => {
  // ============================================================
  // fetchNewVideos 테스트
  // ============================================================
  describe("fetchNewVideos", () => {
    // 테스트 1: 빈 모니터링 채널 목록일 때 빈 배열을 반환한다
    it("빈 모니터링 채널 목록일 때 빈 배열을 반환한다", async () => {
      const mockClient = createMockApiClient();
      const settings = createTestSettings({ monitoredChannels: [] });
      const manager = new SubscriptionManager(mockClient, settings);

      const result = await manager.fetchNewVideos();

      expect(result).toEqual([]);
      // API 클라이언트가 호출되지 않아야 한다
      expect(mockClient.fetchRecentVideos).not.toHaveBeenCalled();
    });

    // 테스트 2: API가 빈 영상 목록을 반환하면 빈 배열을 반환한다
    it("API가 빈 영상 목록을 반환하면 빈 배열을 반환한다", async () => {
      const mockClient = createMockApiClient();
      const settings = createTestSettings({
        monitoredChannels: [
          { channelId: "UC_ch_1", channelTitle: "채널 A", thumbnailUrl: "https://example.com/a.jpg" },
        ],
      });
      const manager = new SubscriptionManager(mockClient, settings);

      mockClient.fetchRecentVideos.mockResolvedValue({
        items: [],
        nextPageToken: null,
      });

      const result = await manager.fetchNewVideos();

      expect(result).toEqual([]);
    });

    // 테스트 3: 영상이 있는 경우 채널별로 그룹화하여 반환한다
    it("영상이 있는 경우 채널별로 그룹화하여 반환한다", async () => {
      const mockClient = createMockApiClient();
      const settings = createTestSettings({
        monitoredChannels: [
          { channelId: "UC_ch_1", channelTitle: "채널 A", thumbnailUrl: "https://example.com/a.jpg" },
          { channelId: "UC_ch_2", channelTitle: "채널 B", thumbnailUrl: "https://example.com/b.jpg" },
        ],
      });
      const manager = new SubscriptionManager(mockClient, settings);

      mockPlaylists(mockClient, {
        // 채널 A: 영상 2개
        UU_ch_1: [
          createVideoItem({ videoId: "vid_a1", channelId: "UC_ch_1", channelTitle: "채널 A", publishedAt: "2024-06-15T10:00:00Z" }),
          createVideoItem({ videoId: "vid_a2", channelId: "UC_ch_1", channelTitle: "채널 A", publishedAt: "2024-06-10T10:00:00Z" }),
        ],
        // 채널 B: 영상 1개
        UU_ch_2: [
          createVideoItem({ videoId: "vid_b1", channelId: "UC_ch_2", channelTitle: "채널 B", publishedAt: "2024-06-20T10:00:00Z" }),
        ],
      });

      const result = await manager.fetchNewVideos();

      // 두 채널 모두 결과에 포함되어야 한다
      expect(result).toHaveLength(2);

      // 채널 A 그룹 검증
      const channelA = result.find((r) => r.channelId === "UC_ch_1");
      expect(channelA).toBeDefined();
      expect(channelA!.channelTitle).toBe("채널 A");
      expect(channelA!.videos).toHaveLength(2);

      // 채널 B 그룹 검증
      const channelB = result.find((r) => r.channelId === "UC_ch_2");
      expect(channelB).toBeDefined();
      expect(channelB!.channelTitle).toBe("채널 B");
      expect(channelB!.videos).toHaveLength(1);
    });

    // 테스트 4: 개별 채널 조회 실패 시 해당 채널만 건너뛰고 나머지 채널은 정상 처리한다
    it("개별 채널 조회 실패 시 해당 채널만 건너뛰고 나머지 채널은 정상 처리한다", async () => {
      const mockClient = createMockApiClient();
      const settings = createTestSettings({
        monitoredChannels: [
          { channelId: "UC_fail", channelTitle: "실패 채널", thumbnailUrl: "https://example.com/fail.jpg" },
          { channelId: "UC_ok", channelTitle: "정상 채널", thumbnailUrl: "https://example.com/ok.jpg" },
        ],
      });
      const manager = new SubscriptionManager(mockClient, settings);

      // 첫 번째 채널: API 오류 발생, 두 번째 채널: 정상 응답
      mockPlaylists(mockClient, {
        UU_fail: new Error("API 오류"),
        UU_ok: [
          createVideoItem({ videoId: "vid_ok", channelId: "UC_ok", channelTitle: "정상 채널", publishedAt: "2024-06-15T10:00:00Z" }),
        ],
      });

      const result = await manager.fetchNewVideos();

      // 실패한 채널은 건너뛰고 정상 채널만 결과에 포함
      expect(result).toHaveLength(1);
      expect(result[0].channelId).toBe("UC_ok");
      expect(result[0].videos).toHaveLength(1);
      expect(manager.lastFetchError).toEqual(new Error("API 오류"));
    });
  });

  // ============================================================
  // 쇼츠 제외와 videosPerChannel 기반 동작 테스트
  // ============================================================
  describe("쇼츠 제외와 videosPerChannel 기반 동작", () => {
    const channel = { channelId: "UC_ch_1", channelTitle: "채널 A", thumbnailUrl: "https://example.com/a.jpg" };
    const videos = (...ids: string[]): VideoItem[] => ids.map((videoId) => createVideoItem({ videoId }));

    // 테스트 5: 쇼츠를 빼고 일반 영상만 videosPerChannel개까지 반환한다
    it("쇼츠를 빼고 일반 영상만 videosPerChannel개까지 순서대로 반환한다", async () => {
      const mockClient = createMockApiClient();
      const manager = new SubscriptionManager(
        mockClient,
        createTestSettings({ monitoredChannels: [channel], videosPerChannel: 2 })
      );
      mockPlaylists(mockClient, {
        UU_ch_1: videos("short_1", "long_1", "short_2", "long_2", "long_3"),
        UUSH_ch_1: videos("short_1", "short_2", "short_old"),
      });

      const result = await manager.fetchNewVideos();

      // 최신 2개가 쇼츠여도 일반 영상으로 2개를 채운다
      expect(result[0].videos.map((video) => video.videoId)).toEqual(["long_1", "long_2"]);
      // 쇼츠를 빼고도 개수를 채울 수 있게 두 재생목록 모두 한 페이지 최대치(50)로 조회한다
      expect(mockClient.fetchRecentVideos.mock.calls).toEqual([["UU_ch_1", 50], ["UUSH_ch_1", 50]]);
    });

    // 테스트 6: 최근 업로드가 전부 쇼츠면 채널을 결과에서 뺀다
    it("최근 업로드가 전부 쇼츠면 채널을 결과에 넣지 않는다", async () => {
      const mockClient = createMockApiClient();
      const manager = new SubscriptionManager(mockClient, createTestSettings({ monitoredChannels: [channel] }));
      mockPlaylists(mockClient, { UU_ch_1: videos("short_1"), UUSH_ch_1: videos("short_1") });

      expect(await manager.fetchNewVideos()).toEqual([]);
    });

    // 테스트 7: 쇼츠가 없는 채널(쇼츠 재생목록 404)은 업로드 영상을 그대로 반환한다
    it("쇼츠 재생목록이 없는 채널(404)은 업로드 영상을 기본값 6개까지 반환한다", async () => {
      const mockClient = createMockApiClient();
      const manager = new SubscriptionManager(mockClient, createTestSettings({ monitoredChannels: [channel] }));
      mockPlaylists(mockClient, { UU_ch_1: videos("v1", "v2", "v3", "v4", "v5", "v6", "v7") });

      const result = await manager.fetchNewVideos();

      expect(result[0].videos.map((video) => video.videoId)).toEqual(["v1", "v2", "v3", "v4", "v5", "v6"]);
      expect(manager.lastFetchError).toBeUndefined();
    });

    // 테스트 8: 쇼츠 조회가 404가 아닌 오류로 실패하면 쇼츠를 섞어 보여주지 않고 채널을 건너뛴다
    it("쇼츠 조회가 할당량 초과 등으로 실패하면 채널을 건너뛰고 오류를 남긴다", async () => {
      const mockClient = createMockApiClient();
      const manager = new SubscriptionManager(mockClient, createTestSettings({ monitoredChannels: [channel] }));
      const quotaError = new YouTubeDataApiError("quotaExceeded", 403);
      mockPlaylists(mockClient, { UU_ch_1: videos("v1"), UUSH_ch_1: quotaError });

      expect(await manager.fetchNewVideos()).toEqual([]);
      expect(manager.lastFetchError).toBe(quotaError);
    });
  });
});
