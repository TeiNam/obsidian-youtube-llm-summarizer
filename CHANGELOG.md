# Changelog

Notable changes to this plugin. Versions match the release tags.

## Unreleased

### Changed

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
