// ============================================================
// 다국어(i18n) 지원 모듈
// 영어(en)·한국어(ko)·일본어(ja)를 지원하며, 설정에서 언어를 변경할 수 있다
// 로컬 자막 요약과 모델 설정의 안내 문구
// ============================================================

import { getLanguage } from "obsidian";

/** 지원 언어 타입 */
export type Language = "en" | "ko" | "ja";

/** 시스템 언어에서 지원 UI 언어를 감지한다 (첫 실행 초기값용) */
export function detectLanguage(): Language {
  const system = getLanguage();
  return system.startsWith("ko") ? "ko" : system.startsWith("ja") ? "ja" : "en";
}

/** 번역 키 인터페이스 */
export interface Translations {
  // 설정 탭 헤더
  settingsDescription: string;
  sponsorLabel: string;

  // 언어 설정
  languageLabel: string;
  toggleVisibilityAria: string;
  languageDesc: string;

  // AI 모델 설정
  summaryLanguageLabel: string;
  summaryLanguageDesc: string;
  providerLabel: string;
  providerDesc: string;
  modelLabel: string;
  modelDesc: string;
  modelManualOption: string;
  connectionTestLabel: string;
  connectionTestDesc: string;
  connectionTestButton: string;
  connectionTesting: string;
  connectionOk: string;
  connectionOkProfile: string;
  connectionOkBearer: string;
  connectionOkFallback: string;
  noticeBearerFallback: string;
  openNoteLink: string;
  commandOpenSidebar: string;
  infoProviderLabel: string;
  infoModelLabel: string;
  infoNotSet: string;
  infoFeedLabel: string;
  infoFeedReady: string;
  infoFeedNeedsKey: string;
  infoFeedNoChannels: string;
  infoChannelsLabel: string;
  infoGroupsLabel: string;
  bulkCancelButton: string;
  bulkSkipped: (count: number) => string;
  bulkCancelled: (count: number) => string;
  modelListButton: string;
  modelListLoading: string;
  modelListLoaded: (count: number) => string;
  errorModelList: string;
  bedrockTokenLabel: string;
  bedrockTokenDesc: string;
  bedrockRegionLabel: string;
  bedrockRegionDesc: string;
  bedrockProfileLabel: string;
  bedrockProfileDesc: string;
  modelApiKeyLabel: string;
  modelApiKeyDesc: string;
  openaiBaseUrlLabel: string;
  openaiBaseUrlDesc: string;
  maxInputCharsLabel: string;
  maxInputCharsDesc: string;
  maxOutputTokensLabel: string;
  maxOutputTokensDesc: string;
  errorMissingModel: string;
  errorDesktopProfile: string;
  errorProfileRuntime: string;
  errorInvalidRegion: string;
  errorInvalidBaseUrl: string;
  errorInvalidLimits: string;
  errorNoCaptions: string;
  errorCaptionAccess: string;
  errorCaptionFormat: string;
  errorCaptionIncomplete: string;
  errorCaptionsTimeout: string;
  errorModelTimeout: string;
  errorModelTruncated: string;
  errorModelEmpty: string;
  errorModelBlocked: string;
  errorSummaryFormat: string;
  errorInputTooLong: string;
  errorModelRequest: string;
  errorProfileCredentials: string;

  // 저장 폴더
  saveFolderLabel: string;
  saveFolderDesc: string;

  // 사이드바 뷰
  sidebarTitle: string;
  urlPlaceholder: string;
  summarizeButton: string;
  summarizingButton: string;

  // 진행 단계
  stageValidating: string;
  stagePending: string;
  stageExtracting: string;
  stageTranslating: string;
  stageSummarizing: string;
  stageCreatingNote: string;
  stageComplete: string;

  // 오류/알림 메시지
  errorEmptyUrl: string;
  errorInvalidUrl: string;
  errorNotInitialized: string;
  errorSummarizeFailed: string;
  errorMissingApiKey: string;
  noticeSummaryComplete: string;

  // 구독 피드 설정
  youtubeDataApiKeyLabel: string;
  youtubeDataApiKeyDesc: string;
  addChannelLabel: string;
  addChannelDesc: string;
  addChannelButton: string;
  addingChannel: string;
  removeChannelButton: string;
  subscriptionChannelsLabel: string;
  subscriptionSaveFolderLabel: string;
  subscriptionSaveFolderDesc: string;
  subscriptionSectionHeader: string;
  errorChannelNotFound: string;

  // 사이드바 탭
  tabUrlSummary: string;
  tabSubscriptionFeed: string;

  // 피드 뷰
  feedRefreshButton: string;
  feedLoading: string;
  feedEmpty: string;
  feedNoChannels: string;
  feedSummarizeButton: string;
  feedSummarizing: string;
  feedSummarized: string;
  feedSummaryError: string;

  // 구독 피드 오류 메시지
  errorInvalidYoutubeDataApiKey: string;
  errorNetworkConnection: string;
  errorFetchSubscriptions: string;

  // 채널별 저장 폴더
  channelSaveFolderLabel: string;
  channelSaveFolderDesc: string;
  channelSaveFolderDefault: string;

  // 채널당 영상 개수 설정
  videosPerChannelLabel: string;
  videosPerChannelDesc: string;

  // 스크립트 직접 입력
  scriptLabel: string;
  scriptPlaceholder: string;
  scriptHint: string;

  // 벌크(여러 URL) 입력
  bulkLabel: string;
  bulkPlaceholder: string;
  bulkHint: string;
  bulkButton: string;
  bulkProgress: (done: number, total: number) => string;
  bulkDone: (ok: number, fail: number) => string;

  // 채널 그룹
  channelGroupLabel: string;
  channelGroupDesc: string;
  feedUngrouped: string;

  // 피드 페이지네이션
  feedShowMore: string;

  // 채널 자동 요약
  channelAutoSummaryLabel: string;
  channelAutoSummaryDesc: string;
  noticeAutoSummarized: (title: string) => string;
  noticeAutoSummaryFailed: (title: string, reason: string) => string;
}

/** 영어 번역 */
const en: Translations = {
  settingsDescription: "Turns YouTube captions into structured study notes. Captions are fetched from YouTube and sent directly to the AI provider you select below; nothing is sent until you start a summary or turn on auto summarize for a channel.",
  sponsorLabel: "If you find this plugin useful, consider supporting its development.",

  languageLabel: "Language",
  toggleVisibilityAria: "Toggle visibility",
  languageDesc: "Select the display language for the plugin UI",

  summaryLanguageLabel: "Summary language",
  summaryLanguageDesc: "Language of translations and generated notes, independent of the UI language",
  providerLabel: "AI provider",
  providerDesc: "The selected provider receives the transcript for translation and summarization",
  modelLabel: "Model ID",
  modelDesc: "Enter a text model ID you can access. Claude Sonnet is recommended, e.g. claude-sonnet-4-6 (Bedrock also accepts inference profile IDs/ARNs)",
  modelManualOption: "Enter manually...",
  connectionTestLabel: "Connection test",
  connectionTestDesc: "Send a short request with the current settings to check authentication and the model. Uses a few tokens.",
  connectionTestButton: "Test",
  connectionTesting: "Testing...",
  connectionOk: "Connection succeeded.",
  connectionOkProfile: "Connection succeeded with the AWS profile.",
  connectionOkBearer: "Connection succeeded with the Bearer token.",
  connectionOkFallback: "Connection succeeded with the Bearer token. The AWS profile credentials could not be loaded.",
  noticeBearerFallback: "Could not load AWS profile credentials. Using the Bedrock Bearer token instead.",
  openNoteLink: "Open note",
  commandOpenSidebar: "Open sidebar",
  infoProviderLabel: "AI provider",
  infoModelLabel: "Model",
  infoNotSet: "Not set",
  infoFeedLabel: "Subscription feed",
  infoFeedReady: "Ready",
  infoFeedNeedsKey: "YouTube Data API key required",
  infoFeedNoChannels: "No channels added",
  infoChannelsLabel: "Channels",
  infoGroupsLabel: "Groups",
  bulkCancelButton: "Stop after current video",
  bulkSkipped: (count) => `${count} line(s) are not YouTube links and were skipped.`,
  bulkCancelled: (count) => `Stopped. ${count} link(s) were not processed.`,
  modelListButton: "Load models",
  modelListLoading: "Loading...",
  modelListLoaded: (count) => `Loaded ${count} models. Pick one in the model ID field. The Bedrock list is saved until you load it again.`,
  errorModelList: "Could not load the model list. Check the credentials, region and network.",
  bedrockTokenLabel: "Bedrock Bearer token",
  bedrockTokenDesc: "Paste the Bedrock API key without the Bearer prefix. Used when no AWS profile is set or its credentials cannot be loaded, and on mobile. Kept in the secret storage on this device, not in the plugin data file.",
  bedrockRegionLabel: "AWS region",
  bedrockRegionDesc: "Region where the selected model or inference profile is available",
  bedrockProfileLabel: "AWS profile",
  bedrockProfileDesc: "Optional, desktop only. Tried first when set (IAM Roles Anywhere credential_process or SSO); falls back to the Bearer token if credentials cannot be loaded. Profile from ~/.aws/config. For SSO, first run aws sso login --profile <profile> in a terminal. The plugin uses the SDK's cached credentials.",
  modelApiKeyLabel: "Model API key",
  modelApiKeyDesc: "Kept separately for each provider in the secret storage on this device, not in the plugin data file. Only loopback OpenAI-compatible servers work without a key.",
  openaiBaseUrlLabel: "OpenAI-compatible base URL",
  openaiBaseUrlDesc: "Include /v1. Examples: https://api.openai.com/v1 or http://localhost:11434/v1 (Ollama). Changing the URL sends this provider's key to the new endpoint.",
  maxInputCharsLabel: "Maximum input characters",
  maxInputCharsDesc: "Maximum transcript / translated text length (1,000–1,000,000). Longer input stops with an error; it is never silently cut.",
  maxOutputTokensLabel: "Maximum output tokens per call",
  maxOutputTokensDesc: "128–128,000, within your model's output limit. Long translations are split. Increase this if a response is truncated.",
  errorMissingModel: "Enter a model ID in settings.",
  errorDesktopProfile: "AWS profile authentication requires Obsidian Desktop. Enter a Bearer token for mobile.",
  errorProfileRuntime: "AWS profile authentication requires an Obsidian runtime with Node.js 20 or later. Update the Obsidian desktop installer or use a Bearer token.",
  errorInvalidRegion: "Enter a valid AWS region in settings.",
  errorInvalidBaseUrl: "Enter a valid HTTPS base URL without credentials, query parameters or a fragment. HTTP is allowed only for localhost.",
  errorInvalidLimits: "Check the input character limit (1,000–1,000,000) and output token limit (128–128,000). Use whole numbers.",
  errorNoCaptions: "No usable captions are available yet. Try again after YouTube generates them, or paste a transcript. Automatic captions are not guaranteed within one day.",
  errorCaptionAccess: "YouTube could not provide this video's captions (access restriction, login or request limit). Try again later or paste a transcript.",
  errorCaptionFormat: "Could not read YouTube's caption response. Try again later or paste a transcript.",
  errorCaptionIncomplete: "The captions are too short for this video and may be incomplete. Try again later or paste the full transcript.",
  errorCaptionsTimeout: "The YouTube request timed out. Try again later or paste a transcript.",
  errorModelTimeout: "The model request timed out. No note was saved.",
  errorModelTruncated: "The model response was truncated. Increase the output token limit within the model's supported range, or use a shorter transcript. No note was saved.",
  errorModelEmpty: "The model returned no text. Check the model and output token limit.",
  errorModelBlocked: "The model could not complete the request (filter, refusal or unsupported response). No note was saved.",
  errorSummaryFormat: "The model's summary is missing the DETAILED section. Try again or select a model that follows the required format.",
  errorInputTooLong: "The transcript or translation exceeds the input character limit. Increase the limit within the model's context window or provide a shorter transcript. No text was silently cut.",
  errorModelRequest: "Model request failed. Check authentication, model ID, endpoint/region and provider quota.",
  errorProfileCredentials: "Could not load AWS profile credentials. Check the profile and run aws sso login --profile <profile> again if it uses SSO.",

  saveFolderLabel: "Save folder",
  saveFolderDesc: "Folder path where summary notes will be saved",

  sidebarTitle: "YouTube LLM Summarizer",
  urlPlaceholder: "Paste a YouTube link here",
  summarizeButton: "Summarize",
  summarizingButton: "Summarizing...",

  stageValidating: "Validating URL...",
  stagePending: "Waiting...",
  stageExtracting: "Extracting subtitles...",
  stageTranslating: "Translating...",
  stageSummarizing: "Generating summary...",
  stageCreatingNote: "Creating note...",
  stageComplete: "Summary complete",

  errorEmptyUrl: "Please enter a YouTube link",
  errorInvalidUrl: "Please enter a valid YouTube link",
  errorNotInitialized: "Plugin is not properly initialized.",
  errorSummarizeFailed: "Failed to generate summary. Please try again",
  errorMissingApiKey: "Enter the selected AI provider's API key or an AWS profile in settings.",
  noticeSummaryComplete: "Summary complete",

  // 구독 피드 설정
  youtubeDataApiKeyLabel: "YouTube Data API key",
  youtubeDataApiKeyDesc: "Google Cloud Console → Create Project → Enable YouTube Data API v3 → Credentials → Create API Key",
  addChannelLabel: "Add channel",
  addChannelDesc: "Enter a YouTube channel handle (e.g. @sosumonkey) or channel ID (e.g. UCxxxx)",
  addChannelButton: "Add",
  addingChannel: "Adding...",
  removeChannelButton: "Remove",
  subscriptionChannelsLabel: "Monitored channels",
  subscriptionSaveFolderLabel: "Subscription save folder",
  subscriptionSaveFolderDesc: "Folder path where subscription summary notes will be saved",
  subscriptionSectionHeader: "YouTube subscription feed",
  errorChannelNotFound: "Channel not found. Please check the channel handle or ID",

  // 사이드바 탭
  tabUrlSummary: "URL summary",
  tabSubscriptionFeed: "Subscription feed",

  // 피드 뷰
  feedRefreshButton: "Refresh",
  feedLoading: "Loading feed...",
  feedEmpty: "No new videos found",
  feedNoChannels: "No channels yet. Add channels under Settings → YouTube LLM Summarizer → Monitored channels.",
  feedSummarizeButton: "Summarize",
  feedSummarizing: "Summarizing...",
  feedSummarized: "Summary complete",
  feedSummaryError: "Summary failed",

  // 구독 피드 오류 메시지
  errorInvalidYoutubeDataApiKey: "YouTube Data API key is invalid. Please check your settings",
  errorNetworkConnection: "Network connection error. Please check your network",
  errorFetchSubscriptions: "Failed to fetch subscriptions. Please try again",

  // 채널별 저장 폴더
  channelSaveFolderLabel: "Channel save folder",
  channelSaveFolderDesc: "Select a folder for this channel's summary notes (leave default to use common folder)",
  channelSaveFolderDefault: "Use default folder",

  // 채널당 영상 개수 설정
  videosPerChannelLabel: "Videos per channel",
  videosPerChannelDesc: "Number of latest videos to show per channel (1-10)",

  // 스크립트 직접 입력
  scriptLabel: "Script / transcript",
  scriptPlaceholder: "Paste the video script or transcript here (optional)",
  scriptHint: "If provided, this text will be used for summarization instead of auto-extraction.",

  bulkLabel: "Bulk summarize (multiple links)",
  bulkPlaceholder: "One YouTube link per line",
  bulkHint: "Links run sequentially, one at a time. Invalid lines are skipped.",
  bulkButton: "Summarize all",
  bulkProgress: (done, total) => `Processing ${done}/${total}...`,
  bulkDone: (ok, fail) => `Done: ${ok} succeeded, ${fail} failed`,

  // 채널 그룹
  channelGroupLabel: "Group",
  channelGroupDesc: "Group this channel under a name (e.g. Stocks, Study). Leave empty for no group.",
  feedUngrouped: "Ungrouped",

  // 피드 페이지네이션
  feedShowMore: "Show more",

  // 채널 자동 요약
  channelAutoSummaryLabel: "Auto summarize",
  channelAutoSummaryDesc: "Checks this channel once a day and summarizes new videos into notes once a day has passed since upload, giving YouTube time to generate captions. A video whose captions are still missing is tried again the next day. Only regular videos uploaded after you turn this on are included. Runs while Obsidian is open and uses your AI provider.",
  noticeAutoSummarized: (title) => `Auto summary created: ${title}`,
  noticeAutoSummaryFailed: (title, reason) => `Auto summary failed: ${title}\n${reason}`,
};

/** 한국어 번역 */
const ko: Translations = {
  settingsDescription: "유튜브 자막을 구조화된 공부 노트로 만들어 줍니다. 자막은 유튜브에서 가져와 아래에서 선택한 AI 제공자에게 직접 보내며, 요약을 시작하거나 채널의 자동 요약을 켜기 전에는 아무것도 전송하지 않습니다.",
  sponsorLabel: "이 플러그인이 유용하다면 개발을 후원해 주세요.",

  languageLabel: "언어 (Language)",
  toggleVisibilityAria: "표시 전환",
  languageDesc: "플러그인 UI 표시 언어를 선택합니다",

  summaryLanguageLabel: "요약 언어",
  summaryLanguageDesc: "UI 언어와 별도로 번역문과 요약 노트의 언어를 선택합니다",
  providerLabel: "AI 제공자",
  providerDesc: "선택한 제공자에게 자막을 전송하여 번역·요약합니다",
  modelLabel: "모델 ID",
  modelDesc: "접근 가능한 텍스트 모델 ID를 입력하세요. Claude Sonnet 계열을 권장합니다 (예: claude-sonnet-4-6). Bedrock은 추론 프로필 ID/ARN도 지원합니다",
  modelManualOption: "직접 입력...",
  connectionTestLabel: "연결 테스트",
  connectionTestDesc: "현재 설정으로 짧은 요청을 보내 인증과 모델이 동작하는지 확인합니다. 토큰을 소량 사용합니다",
  connectionTestButton: "테스트",
  connectionTesting: "확인 중...",
  connectionOk: "연결에 성공했습니다.",
  connectionOkProfile: "AWS 프로필로 연결에 성공했습니다.",
  connectionOkBearer: "Bearer 토큰으로 연결에 성공했습니다.",
  connectionOkFallback: "Bearer 토큰으로 연결에 성공했습니다. AWS 프로필 자격 증명은 불러오지 못했습니다.",
  noticeBearerFallback: "AWS 프로필 자격 증명을 불러오지 못해 Bedrock Bearer 토큰으로 진행합니다.",
  openNoteLink: "노트 열기",
  commandOpenSidebar: "사이드바 열기",
  infoProviderLabel: "AI 제공자",
  infoModelLabel: "모델",
  infoNotSet: "미설정",
  infoFeedLabel: "구독 피드",
  infoFeedReady: "사용 가능",
  infoFeedNeedsKey: "YouTube Data API 키 필요",
  infoFeedNoChannels: "추가된 채널 없음",
  infoChannelsLabel: "구독 채널",
  infoGroupsLabel: "그룹",
  bulkCancelButton: "현재 영상까지만 하고 중단",
  bulkSkipped: (count) => `유튜브 링크가 아닌 ${count}줄은 건너뛰었습니다.`,
  bulkCancelled: (count) => `중단했습니다. 남은 링크 ${count}개는 처리하지 않았습니다.`,
  modelListButton: "모델 불러오기",
  modelListLoading: "불러오는 중...",
  modelListLoaded: (count) => `모델 ${count}개를 불러왔습니다. 모델 ID 입력란에서 선택하세요. Bedrock 목록은 다시 불러올 때까지 저장됩니다.`,
  errorModelList: "모델 목록을 불러오지 못했습니다. 인증 정보·리전·네트워크를 확인해주세요.",
  bedrockTokenLabel: "Bedrock Bearer 토큰",
  bedrockTokenDesc: "Bearer 접두사 없이 Bedrock API 키를 입력하세요. AWS 프로필이 비어 있거나 자격 증명을 불러오지 못할 때, 그리고 모바일에서 사용합니다. 플러그인 데이터 파일이 아니라 이 기기의 시크릿 키 저장소에 보관합니다",
  bedrockRegionLabel: "AWS 리전",
  bedrockRegionDesc: "선택한 모델이나 추론 프로필을 사용할 수 있는 리전입니다",
  bedrockProfileLabel: "AWS 프로필",
  bedrockProfileDesc: "선택 사항이며 데스크톱 전용입니다. 입력하면 먼저 시도하고(IAM Roles Anywhere credential_process·SSO), 자격 증명을 불러오지 못하면 Bearer 토큰으로 넘어갑니다. ~/.aws/config의 프로필 이름입니다. SSO는 터미널에서 aws sso login --profile <프로필>로 먼저 로그인하세요. SDK가 캐시된 자격 증명을 사용합니다",
  modelApiKeyLabel: "모델 API 키",
  modelApiKeyDesc: "제공자마다 따로, 플러그인 데이터 파일이 아니라 이 기기의 시크릿 키 저장소에 보관합니다. 로컬 OpenAI 호환 서버만 키 없이 사용할 수 있습니다",
  openaiBaseUrlLabel: "OpenAI 호환 기본 URL",
  openaiBaseUrlDesc: "/v1까지 입력하세요. 예: https://api.openai.com/v1, http://localhost:11434/v1 (Ollama). URL을 바꾸면 이 제공자의 키가 새 주소로 전송됩니다",
  maxInputCharsLabel: "최대 입력 글자 수",
  maxInputCharsDesc: "자막과 번역문의 상한입니다 (1,000~1,000,000자). 넘으면 오류로 중단하며 뒷부분을 임의로 자르지 않습니다",
  maxOutputTokensLabel: "호출당 최대 출력 토큰",
  maxOutputTokensDesc: "모델의 출력 한도 이내로 설정하세요 (128~128,000). 긴 번역은 나누어 처리하며 응답이 잘리면 이 값을 늘려 재시도하세요",
  errorMissingModel: "설정에서 모델 ID를 입력해주세요.",
  errorDesktopProfile: "AWS 프로필·SSO 인증은 옵시디언 데스크톱에서 사용할 수 있습니다. 모바일에서는 Bearer 토큰을 입력해주세요.",
  errorProfileRuntime: "AWS 프로필 인증에는 Node.js 20 이상인 옵시디언 런타임이 필요합니다. 옵시디언 데스크톱 설치 프로그램을 업데이트하거나 Bearer 토큰을 사용해주세요.",
  errorInvalidRegion: "설정에서 올바른 AWS 리전을 입력해주세요.",
  errorInvalidBaseUrl: "인증 정보·쿼리·프래그먼트가 없는 HTTPS 기본 URL을 입력해주세요. HTTP는 로컬 PC 주소만 허용합니다.",
  errorInvalidLimits: "입력 글자 수(1,000~1,000,000)와 출력 토큰(128~128,000)을 범위 내 정수로 설정해주세요.",
  errorNoCaptions: "아직 사용할 수 있는 자막이 없습니다. 유튜브 자막 생성 후 재시도하거나 스크립트를 직접 입력해주세요. 자동 자막이 하루 안에 생성된다는 보장은 없습니다.",
  errorCaptionAccess: "유튜브에서 자막을 가져올 수 없습니다 (접근 제한·로그인·요청 제한). 잠시 후 재시도하거나 스크립트를 직접 입력해주세요.",
  errorCaptionFormat: "유튜브 자막 응답을 읽지 못했습니다. 잠시 후 재시도하거나 스크립트를 직접 입력해주세요.",
  errorCaptionIncomplete: "영상 길이에 비해 자막이 너무 짧아 불완전할 수 있습니다. 나중에 재시도하거나 전체 스크립트를 직접 입력해주세요.",
  errorCaptionsTimeout: "유튜브 요청 시간이 초과되었습니다. 나중에 재시도하거나 스크립트를 직접 입력해주세요.",
  errorModelTimeout: "모델 응답 시간이 초과되었습니다. 노트는 저장하지 않았습니다.",
  errorModelTruncated: "모델 응답이 출력 한도로 잘렸습니다. 모델이 지원하는 범위에서 출력 토큰을 늘리거나 짧은 자막으로 재시도해주세요. 노트는 저장하지 않았습니다.",
  errorModelEmpty: "모델이 텍스트를 반환하지 않았습니다. 모델과 출력 토큰 설정을 확인해주세요.",
  errorModelBlocked: "모델이 요청을 완료하지 못했습니다 (필터·응답 거절·지원하지 않는 응답). 노트는 저장하지 않았습니다.",
  errorSummaryFormat: "모델 요약에 DETAILED 섹션이 없습니다. 다시 시도하거나 출력 형식을 따를 수 있는 모델을 선택해주세요.",
  errorInputTooLong: "자막 또는 번역문이 입력 글자 수 상한을 넘었습니다. 모델의 컨텍스트 한도 내에서 상한을 늘리거나 짧은 자막을 입력해주세요. 뒷부분은 임의로 자르지 않았습니다.",
  errorModelRequest: "모델 호출에 실패했습니다. 인증 정보, 모델 ID, 주소·리전, 제공자 할당량을 확인해주세요.",
  errorProfileCredentials: "AWS 프로필 자격 증명을 불러오지 못했습니다. 프로필을 확인하고 SSO라면 aws sso login --profile <프로필>로 다시 로그인해주세요.",

  saveFolderLabel: "노트 저장 폴더",
  saveFolderDesc: "요약 노트가 저장될 폴더 경로입니다",

  sidebarTitle: "YouTube LLM Summarizer",
  urlPlaceholder: "유튜브 링크를 입력하세요",
  summarizeButton: "요약",
  summarizingButton: "요약 중...",

  stageValidating: "URL 검증 중...",
  stagePending: "대기 중...",
  stageExtracting: "자막 추출 중...",
  stageTranslating: "번역 중...",
  stageSummarizing: "요약 생성 중...",
  stageCreatingNote: "노트 생성 중...",
  stageComplete: "요약이 완료되었습니다",

  errorEmptyUrl: "유튜브 링크를 입력해주세요",
  errorInvalidUrl: "유효한 유튜브 링크를 입력해주세요",
  errorNotInitialized: "플러그인이 올바르게 초기화되지 않았습니다.",
  errorSummarizeFailed: "요약 생성에 실패했습니다. 다시 시도해주세요",
  errorMissingApiKey: "설정에서 선택한 AI 제공자의 API 키나 AWS 프로필을 입력해주세요.",
  noticeSummaryComplete: "요약이 완료되었습니다",

  // 구독 피드 설정
  youtubeDataApiKeyLabel: "YouTube Data API key",
  youtubeDataApiKeyDesc: "Google Cloud Console → 프로젝트 생성 → YouTube Data API v3 사용 설정 → 사용자 인증 정보 → API 키 만들기",
  addChannelLabel: "채널 추가",
  addChannelDesc: "YouTube 채널 핸들 (예: @sosumonkey) 또는 채널 ID (예: UCxxxx)를 입력하세요",
  addChannelButton: "추가",
  addingChannel: "추가 중...",
  removeChannelButton: "삭제",
  subscriptionChannelsLabel: "모니터링 채널 목록",
  subscriptionSaveFolderLabel: "구독 영상 요약 저장 폴더",
  subscriptionSaveFolderDesc: "구독 영상 요약 노트가 저장될 폴더 경로입니다",
  subscriptionSectionHeader: "YouTube 구독 피드",
  errorChannelNotFound: "채널을 찾을 수 없습니다. 채널 핸들 또는 ID를 확인해주세요",

  // 사이드바 탭
  tabUrlSummary: "URL 요약",
  tabSubscriptionFeed: "구독 피드",

  // 피드 뷰
  feedRefreshButton: "새로고침",
  feedLoading: "피드를 불러오는 중...",
  feedEmpty: "새로운 영상이 없습니다",
  feedNoChannels: "아직 채널이 없습니다. 설정 → YouTube LLM Summarizer → 모니터링 채널 목록에서 추가해주세요.",
  feedSummarizeButton: "요약하기",
  feedSummarizing: "요약 중...",
  feedSummarized: "요약 완료",
  feedSummaryError: "요약 실패",

  // 구독 피드 오류 메시지
  errorInvalidYoutubeDataApiKey: "YouTube Data API Key가 유효하지 않습니다. 설정을 확인해주세요",
  errorNetworkConnection: "네트워크 연결을 확인해주세요",
  errorFetchSubscriptions: "구독 목록을 가져오는데 실패했습니다. 다시 시도해주세요",

  // 채널별 저장 폴더
  channelSaveFolderLabel: "채널별 저장 폴더",
  channelSaveFolderDesc: "이 채널의 요약 노트 저장 폴더를 선택하세요 (기본값이면 공통 폴더 사용)",
  channelSaveFolderDefault: "기본 폴더 사용",

  // 채널당 영상 개수 설정
  videosPerChannelLabel: "채널당 영상 개수",
  videosPerChannelDesc: "채널당 표시할 최신 영상 개수 (1~10)",

  // 스크립트 직접 입력
  scriptLabel: "스크립트 / 자막",
  scriptPlaceholder: "영상의 스크립트 또는 자막을 여기에 붙여넣으세요 (선택사항)",
  scriptHint: "입력하면 자동 추출 대신 이 텍스트를 사용하여 요약합니다.",

  bulkLabel: "여러 개 한번에 요약",
  bulkPlaceholder: "한 줄에 유튜브 링크 하나씩",
  bulkHint: "위에서부터 한 번에 하나씩 순차로 요약합니다. 잘못된 줄은 건너뜁니다.",
  bulkButton: "전체 요약",
  bulkProgress: (done, total) => `처리 중 ${done}/${total}...`,
  bulkDone: (ok, fail) => `완료: 성공 ${ok}건, 실패 ${fail}건`,

  // 채널 그룹
  channelGroupLabel: "그룹",
  channelGroupDesc: "이 채널을 그룹명으로 묶습니다 (예: 주식, 스터디). 비우면 그룹 없음.",
  feedUngrouped: "그룹 없음",

  // 피드 페이지네이션
  feedShowMore: "더 보기",

  // 채널 자동 요약
  channelAutoSummaryLabel: "자동 요약",
  channelAutoSummaryDesc: "하루에 한 번 이 채널을 점검해, 업로드 후 하루가 지난(자막이 만들어질 시간을 둔) 새 영상을 자동으로 요약해 노트로 만듭니다. 자막이 아직 없으면 다음 날 다시 시도합니다. 이 설정을 켠 뒤에 올라온 일반 영상만 대상입니다. Obsidian이 열려 있는 동안 동작하며 AI 제공자 요금이 발생합니다.",
  noticeAutoSummarized: (title) => `자동 요약 완료: ${title}`,
  noticeAutoSummaryFailed: (title, reason) => `자동 요약 실패: ${title}\n${reason}`,
};

/** 일본어 번역 */
const ja: Translations = {
  settingsDescription: "YouTubeの字幕を構造化された学習ノートにまとめます。字幕はYouTubeから取得し、下で選択したAIプロバイダーに直接送信します。要約を開始するか、チャンネルの自動要約をオンにするまでは何も送信しません。",
  sponsorLabel: "このプラグインが役に立ったら、開発へのご支援をご検討ください。",

  languageLabel: "言語 (Language)",
  toggleVisibilityAria: "表示を切り替え",
  languageDesc: "プラグインUIの表示言語を選択します",

  summaryLanguageLabel: "要約言語",
  summaryLanguageDesc: "UI言語とは別に、翻訳文と要約ノートの言語を選択します",
  providerLabel: "AIプロバイダー",
  providerDesc: "選択したプロバイダーに字幕を送信して翻訳・要約します",
  modelLabel: "モデルID",
  modelDesc: "利用できるテキストモデルのIDを入力してください。Claude Sonnet系を推奨します（例: claude-sonnet-4-6）。Bedrockは推論プロファイルID/ARNにも対応しています",
  modelManualOption: "手動で入力...",
  connectionTestLabel: "接続テスト",
  connectionTestDesc: "現在の設定で短いリクエストを送り、認証とモデルが動作するか確認します。トークンを少量消費します",
  connectionTestButton: "テスト",
  connectionTesting: "確認中...",
  connectionOk: "接続に成功しました。",
  connectionOkProfile: "AWSプロファイルで接続に成功しました。",
  connectionOkBearer: "Bearerトークンで接続に成功しました。",
  connectionOkFallback: "Bearerトークンで接続に成功しました。AWSプロファイルの認証情報は読み込めませんでした。",
  noticeBearerFallback: "AWSプロファイルの認証情報を読み込めなかったため、Bedrock Bearerトークンで続行します。",
  openNoteLink: "ノートを開く",
  commandOpenSidebar: "サイドバーを開く",
  infoProviderLabel: "AIプロバイダー",
  infoModelLabel: "モデル",
  infoNotSet: "未設定",
  infoFeedLabel: "登録チャンネルフィード",
  infoFeedReady: "利用可能",
  infoFeedNeedsKey: "YouTube Data APIキーが必要",
  infoFeedNoChannels: "追加されたチャンネルなし",
  infoChannelsLabel: "登録チャンネル",
  infoGroupsLabel: "グループ",
  bulkCancelButton: "現在の動画が終わったら中止",
  bulkSkipped: (count) => `YouTubeリンクではない${count}行をスキップしました。`,
  bulkCancelled: (count) => `中止しました。残りのリンク${count}件は処理していません。`,
  modelListButton: "モデルを読み込む",
  modelListLoading: "読み込み中...",
  modelListLoaded: (count) => `モデルを${count}件読み込みました。モデルIDの入力欄から選択してください。Bedrockの一覧は再読み込みするまで保存されます。`,
  errorModelList: "モデル一覧を読み込めませんでした。認証情報・リージョン・ネットワークを確認してください。",
  bedrockTokenLabel: "Bedrock Bearerトークン",
  bedrockTokenDesc: "Bearerの接頭辞を付けずにBedrock APIキーを入力してください。AWSプロファイルが空のとき、認証情報を読み込めないとき、およびモバイルで使用します。プラグインのデータファイルではなく、このデバイスのシークレットストレージに保存します",
  bedrockRegionLabel: "AWSリージョン",
  bedrockRegionDesc: "選択したモデルまたは推論プロファイルを利用できるリージョンです",
  bedrockProfileLabel: "AWSプロファイル",
  bedrockProfileDesc: "任意、デスクトップ専用です。入力すると最初に試行し（IAM Roles Anywhereのcredential_process・SSO）、認証情報を読み込めない場合はBearerトークンに切り替えます。~/.aws/configのプロファイル名です。SSOの場合は先にターミナルで aws sso login --profile <プロファイル> を実行してください。SDKがキャッシュした認証情報を使用します",
  modelApiKeyLabel: "モデルAPIキー",
  modelApiKeyDesc: "プロバイダーごとに分けて、プラグインのデータファイルではなく、このデバイスのシークレットストレージに保存します。キーなしで使えるのはローカルのOpenAI互換サーバーのみです",
  openaiBaseUrlLabel: "OpenAI互換ベースURL",
  openaiBaseUrlDesc: "/v1まで入力してください。例: https://api.openai.com/v1、http://localhost:11434/v1 (Ollama)。URLを変更すると、このプロバイダーのキーが新しいアドレスに送信されます",
  maxInputCharsLabel: "最大入力文字数",
  maxInputCharsDesc: "字幕と翻訳文の上限です（1,000〜1,000,000文字）。超えるとエラーで停止し、後半を勝手に切り捨てることはありません",
  maxOutputTokensLabel: "1回の呼び出しあたりの最大出力トークン",
  maxOutputTokensDesc: "モデルの出力上限以内で設定してください（128〜128,000）。長い翻訳は分割して処理します。応答が途中で切れる場合はこの値を増やしてください",
  errorMissingModel: "設定でモデルIDを入力してください。",
  errorDesktopProfile: "AWSプロファイル・SSO認証はObsidianデスクトップ版で利用できます。モバイルではBearerトークンを入力してください。",
  errorProfileRuntime: "AWSプロファイル認証にはNode.js 20以降のObsidianランタイムが必要です。Obsidianデスクトップのインストーラーを更新するか、Bearerトークンを使用してください。",
  errorInvalidRegion: "設定で正しいAWSリージョンを入力してください。",
  errorInvalidBaseUrl: "認証情報・クエリ・フラグメントを含まないHTTPSのベースURLを入力してください。HTTPはlocalhostのみ使用できます。",
  errorInvalidLimits: "入力文字数（1,000〜1,000,000）と出力トークン（128〜128,000）を範囲内の整数で設定してください。",
  errorNoCaptions: "利用できる字幕がまだありません。YouTubeで字幕が生成されてから再試行するか、スクリプトを直接入力してください。自動字幕が1日以内に生成される保証はありません。",
  errorCaptionAccess: "YouTubeから字幕を取得できません（アクセス制限・ログイン・リクエスト制限）。しばらくしてから再試行するか、スクリプトを直接入力してください。",
  errorCaptionFormat: "YouTubeの字幕応答を読み取れませんでした。しばらくしてから再試行するか、スクリプトを直接入力してください。",
  errorCaptionIncomplete: "動画の長さに対して字幕が短すぎるため、不完全な可能性があります。後で再試行するか、スクリプト全文を直接入力してください。",
  errorCaptionsTimeout: "YouTubeへのリクエストがタイムアウトしました。後で再試行するか、スクリプトを直接入力してください。",
  errorModelTimeout: "モデルへのリクエストがタイムアウトしました。ノートは保存していません。",
  errorModelTruncated: "モデルの応答が出力上限で途中で切れました。モデルが対応する範囲で出力トークンを増やすか、短い字幕で再試行してください。ノートは保存していません。",
  errorModelEmpty: "モデルがテキストを返しませんでした。モデルと出力トークンの設定を確認してください。",
  errorModelBlocked: "モデルがリクエストを完了できませんでした（フィルター・応答拒否・未対応の応答）。ノートは保存していません。",
  errorSummaryFormat: "モデルの要約にDETAILEDセクションがありません。再試行するか、出力形式に従えるモデルを選択してください。",
  errorInputTooLong: "字幕または翻訳文が入力文字数の上限を超えました。モデルのコンテキスト上限の範囲で上限を増やすか、短い字幕を入力してください。後半を勝手に切り捨ててはいません。",
  errorModelRequest: "モデルの呼び出しに失敗しました。認証情報、モデルID、アドレス・リージョン、プロバイダーの割り当てを確認してください。",
  errorProfileCredentials: "AWSプロファイルの認証情報を読み込めませんでした。プロファイルを確認し、SSOの場合は aws sso login --profile <プロファイル> で再度ログインしてください。",

  saveFolderLabel: "ノートの保存フォルダ",
  saveFolderDesc: "要約ノートを保存するフォルダのパスです",

  sidebarTitle: "YouTube LLM Summarizer",
  urlPlaceholder: "YouTubeリンクを入力してください",
  summarizeButton: "要約",
  summarizingButton: "要約中...",

  stageValidating: "URLを検証中...",
  stagePending: "待機中...",
  stageExtracting: "字幕を抽出中...",
  stageTranslating: "翻訳中...",
  stageSummarizing: "要約を生成中...",
  stageCreatingNote: "ノートを作成中...",
  stageComplete: "要約が完了しました",

  errorEmptyUrl: "YouTubeリンクを入力してください",
  errorInvalidUrl: "有効なYouTubeリンクを入力してください",
  errorNotInitialized: "プラグインが正しく初期化されていません。",
  errorSummarizeFailed: "要約の生成に失敗しました。もう一度お試しください",
  errorMissingApiKey: "設定で、選択したAIプロバイダーのAPIキーまたはAWSプロファイルを入力してください。",
  noticeSummaryComplete: "要約が完了しました",

  // 구독 피드 설정
  youtubeDataApiKeyLabel: "YouTube Data APIキー",
  youtubeDataApiKeyDesc: "Google Cloud Console → プロジェクトを作成 → YouTube Data API v3を有効化 → 認証情報 → APIキーを作成",
  addChannelLabel: "チャンネルを追加",
  addChannelDesc: "YouTubeチャンネルのハンドル（例: @sosumonkey）またはチャンネルID（例: UCxxxx）を入力してください",
  addChannelButton: "追加",
  addingChannel: "追加中...",
  removeChannelButton: "削除",
  subscriptionChannelsLabel: "監視チャンネル一覧",
  subscriptionSaveFolderLabel: "登録チャンネル要約の保存フォルダ",
  subscriptionSaveFolderDesc: "登録チャンネルの要約ノートを保存するフォルダのパスです",
  subscriptionSectionHeader: "YouTube登録チャンネルフィード",
  errorChannelNotFound: "チャンネルが見つかりません。チャンネルのハンドルまたはIDを確認してください",

  // 사이드바 탭
  tabUrlSummary: "URL要約",
  tabSubscriptionFeed: "登録チャンネルフィード",

  // 피드 뷰
  feedRefreshButton: "更新",
  feedLoading: "フィードを読み込み中...",
  feedEmpty: "新しい動画はありません",
  feedNoChannels: "チャンネルがまだありません。設定 → YouTube LLM Summarizer → 監視チャンネル一覧から追加してください。",
  feedSummarizeButton: "要約する",
  feedSummarizing: "要約中...",
  feedSummarized: "要約完了",
  feedSummaryError: "要約失敗",

  // 구독 피드 오류 메시지
  errorInvalidYoutubeDataApiKey: "YouTube Data APIキーが無効です。設定を確認してください",
  errorNetworkConnection: "ネットワーク接続を確認してください",
  errorFetchSubscriptions: "登録チャンネルの取得に失敗しました。もう一度お試しください",

  // 채널별 저장 폴더
  channelSaveFolderLabel: "チャンネル別の保存フォルダ",
  channelSaveFolderDesc: "このチャンネルの要約ノートの保存フォルダを選択してください（デフォルトのままなら共通フォルダを使用）",
  channelSaveFolderDefault: "デフォルトのフォルダを使用",

  // 채널당 영상 개수 설정
  videosPerChannelLabel: "チャンネルあたりの動画数",
  videosPerChannelDesc: "チャンネルごとに表示する最新動画の数（1〜10）",

  // 스크립트 직접 입력
  scriptLabel: "スクリプト / 字幕",
  scriptPlaceholder: "動画のスクリプトまたは字幕をここに貼り付けてください（任意）",
  scriptHint: "入力すると、自動抽出の代わりにこのテキストを使って要約します。",

  bulkLabel: "まとめて要約（複数リンク）",
  bulkPlaceholder: "1行にYouTubeリンクを1つずつ",
  bulkHint: "上から順に1件ずつ要約します。無効な行はスキップします。",
  bulkButton: "すべて要約",
  bulkProgress: (done, total) => `処理中 ${done}/${total}...`,
  bulkDone: (ok, fail) => `完了: 成功 ${ok}件、失敗 ${fail}件`,

  // 채널 그룹
  channelGroupLabel: "グループ",
  channelGroupDesc: "このチャンネルをグループ名でまとめます（例: 株式、勉強）。空欄ならグループなし。",
  feedUngrouped: "グループなし",

  // 피드 페이지네이션
  feedShowMore: "もっと見る",

  // 채널 자동 요약
  channelAutoSummaryLabel: "自動要約",
  channelAutoSummaryDesc: "1日に1回このチャンネルを確認し、アップロードから1日経過した（字幕が生成されるのを待った）新しい動画を自動で要約してノートを作成します。字幕がまだない場合は翌日に再試行します。この設定をオンにした後に公開された通常の動画のみが対象です。Obsidianを開いている間に動作し、AIプロバイダーの料金が発生します。",
  noticeAutoSummarized: (title) => `自動要約が完了しました: ${title}`,
  noticeAutoSummaryFailed: (title, reason) => `自動要約に失敗しました: ${title}\n${reason}`,
};

/** 번역 맵 */
const translations: Record<Language, Translations> = { en, ko, ja };

/**
 * 지정된 언어의 번역 객체를 반환
 * @param lang - 언어 코드
 * @returns 번역 객체
 */
export function t(lang: Language): Translations {
  return translations[lang] ?? translations.en;
}
