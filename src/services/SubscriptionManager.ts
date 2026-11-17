// ============================================================
// 구독 관리 서비스
// 모니터링 대상 채널의 최신 영상 조회 및 관리를 담당
// 채널 ID → Uploads 플레이리스트 ID 변환, 쇼츠 제외,
// 채널별 그룹화 기능 제공
// ============================================================

import { YouTubeDataApiError } from "./YouTubeDataApiClient";
import type { YouTubeDataApiClient } from "./YouTubeDataApiClient";

/** playlistItems.list 한 번에 받을 수 있는 최대 개수 */
const PLAYLIST_PAGE_SIZE = 50;
import type {
  PluginSettings,
  ChannelVideos,
} from "../models/types";

/**
 * 구독 관리 서비스 클래스
 * 모니터링 대상 채널의 최신 영상을 조회하고 채널별로 그룹화하여 반환
 */
export class SubscriptionManager {
  private apiClient: YouTubeDataApiClient;
  private settings: PluginSettings;

  /**
   * @param apiClient - YouTube Data API v3 클라이언트
   * @param settings - 플러그인 설정 (모니터링 채널, 채널당 영상 개수 등)
   */
  constructor(apiClient: YouTubeDataApiClient, settings: PluginSettings) {
    this.apiClient = apiClient;
    this.settings = settings;
  }

  /**
   * 채널 ID로부터 Uploads 플레이리스트 ID를 도출
   * 채널 ID의 두 번째 문자를 "U"로 교체 (예: "UCxxxx" → "UUxxxx")
   * @param channelId - YouTube 채널 ID
   * @returns Uploads 플레이리스트 ID
   */
  getUploadsPlaylistId(channelId: string): string {
    return channelId[0] + "U" + channelId.slice(2);
  }

  /**
   * 채널의 최근 쇼츠 영상 ID. 쇼츠만 담긴 재생목록("UUSH" + 채널 ID 뒷부분)에서 가져온다.
   * 쇼츠가 없는 채널은 이 재생목록이 없어 404가 오므로 빈 집합으로 본다.
   * shortcut: Data API에 쇼츠 여부 필드가 없어 문서화되지 않은 재생목록 접두어에 의존한다, YouTube가 이를 없애면 영상 길이 조회로 바꾼다.
   */
  private async fetchShortIds(channelId: string): Promise<Set<string>> {
    try {
      const response = await this.apiClient.fetchRecentVideos(`UUSH${channelId.slice(2)}`, PLAYLIST_PAGE_SIZE);
      return new Set(response.items.map((video) => video.videoId));
    } catch (error) {
      if (error instanceof YouTubeDataApiError && error.statusCode === 404) return new Set();
      throw error;
    }
  }

  /** 마지막 조회에서 채널 조회가 실패한 이유 (피드가 비었을 때 원인 표시용) */
  lastFetchError: unknown;

  /**
   * 모니터링 대상 채널의 최신 영상을 채널별로 그룹화하여 반환
   * 개별 채널 조회 실패 시 해당 채널만 건너뛰고 나머지 채널은 계속 처리
   * @returns 채널별 최신 영상 그룹 배열
   */
  async fetchNewVideos(): Promise<ChannelVideos[]> {
    const results: ChannelVideos[] = [];
    const { monitoredChannels, videosPerChannel } = this.settings;
    this.lastFetchError = undefined;

    for (const channel of monitoredChannels) {
      try {
        const playlistId = this.getUploadsPlaylistId(channel.channelId);
        // 쇼츠를 뺀 뒤에도 개수를 채울 수 있게 넉넉히 가져온다 (요청당 할당량은 개수와 무관하게 1).
        const response = await this.apiClient.fetchRecentVideos(playlistId, PLAYLIST_PAGE_SIZE);
        const shortIds = await this.fetchShortIds(channel.channelId);
        const videos = response.items
          .filter((video) => !shortIds.has(video.videoId))
          .slice(0, videosPerChannel);

        if (videos.length > 0) {
          results.push({
            channelId: channel.channelId,
            channelTitle: channel.channelTitle,
            videos,
          });
        }
      } catch (error) {
        // 개별 채널 실패 시 해당 채널만 건너뛰고 계속 진행
        this.lastFetchError = error;
        continue;
      }
    }

    return results;
  }
}
