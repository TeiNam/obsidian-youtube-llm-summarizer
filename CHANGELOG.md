# Changelog

Notable changes to this plugin. Versions match the release tags.

## Unreleased

### Added

- Per-channel auto summarize. With the toggle on, regular videos uploaded after you enabled it are summarized into notes once a day has passed since upload (time for YouTube to generate captions). Channels are checked once a day while Obsidian is open; a video whose captions are still missing is tried again the next day without a failure notice.
- 채널별 자동 요약을 추가했습니다. 토글을 켜면 그 뒤에 올라온 일반 영상을 업로드 후 하루(자막이 만들어질 시간)가 지난 뒤 요약해 노트로 만듭니다. Obsidian이 열려 있는 동안 하루에 한 번 점검하며, 자막이 아직 없는 영상은 실패 알림 없이 다음 날 다시 시도합니다.

### Changed

- The subscription feed no longer lists Shorts. The per-channel video count now counts regular videos only. Each feed refresh uses two YouTube Data API quota units per channel instead of one.
- 구독 피드에 쇼츠가 나오지 않습니다. 채널당 영상 수는 일반 영상만 셉니다. 피드를 새로 고칠 때 채널당 YouTube Data API 할당량을 1단위가 아니라 2단위 씁니다.

- The channel list in the status panel of the URL summary tab is ordered by group, then by the order channels were added, with ungrouped channels last. This matches the subscription feed tab.
- URL 요약 탭 현황 패널의 채널 목록을 그룹순, 그룹 안에서는 등록순으로 정렬하고 그룹 없는 채널은 맨 뒤에 둡니다. 구독 피드 탭과 같은 순서입니다.

## 1.1.0

### Added

- Japanese UI language. Pick 日本語 under Settings → Language; a first run on a Japanese-language Obsidian selects it automatically.
- UI 언어에 일본어를 추가했습니다. 설정의 언어에서 日本語를 고르며, Obsidian 언어가 일본어면 첫 실행 때 자동으로 선택됩니다.

### Changed

- Notes summarized in Japanese, Simplified Chinese, or Traditional Chinese now use section headings in that language (Summary, Key insights, Genre, One-line summary, Details, Keywords & terms, Further exploration). They were English before. Other non-Korean languages keep English headings. (#12)
- 요약 언어가 일본어·중국어 간체·번체일 때 노트의 고정 제목을 해당 언어로 표기합니다. 이전에는 영어였습니다. 그 밖의 비한국어는 계속 영어 제목입니다. (#12)

### Fixed

- The error shown when a model's summary is missing the DETAILED section now follows the UI language. It used to follow the summary language (Korean or English only).
- 모델 요약에 DETAILED 섹션이 없을 때 나오는 오류 메시지가 UI 언어를 따릅니다. 이전에는 요약 언어 기준으로 한국어 또는 영어로만 나왔습니다.

## 1.0.0

- Initial release.
