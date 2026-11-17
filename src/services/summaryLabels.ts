import { SummaryLanguage } from "../models/types";

const ENGLISH_LABELS = {
  summary: "Summary",
  insights: "Key insights",
  genre: "Genre",
  oneLine: "One-line summary",
  details: "Details",
  keywords: "Keywords & terms",
  further: "Further exploration",
};

export type SummaryLabels = typeof ENGLISH_LABELS;

const LABELS: Partial<Record<SummaryLanguage, SummaryLabels>> = {
  ko: {
    summary: "요약",
    insights: "핵심 인사이트",
    genre: "장르",
    oneLine: "한줄 요약",
    details: "핵심 내용",
    keywords: "키워드 & 용어",
    further: "추가 탐색 주제",
  },
  ja: {
    summary: "要約",
    insights: "重要なインサイト",
    genre: "ジャンル",
    oneLine: "一行要約",
    details: "主な内容",
    keywords: "キーワードと用語",
    further: "さらに調べたいトピック",
  },
  "zh-CN": {
    summary: "摘要",
    insights: "核心洞察",
    genre: "类型",
    oneLine: "一句话总结",
    details: "核心内容",
    keywords: "关键词与术语",
    further: "延伸探索主题",
  },
  "zh-TW": {
    summary: "摘要",
    insights: "核心洞察",
    genre: "類型",
    oneLine: "一句話總結",
    details: "核心內容",
    keywords: "關鍵詞與術語",
    further: "延伸探索主題",
  },
};

/** 노트 고정 제목. 미지정은 한국어, 표에 없는 언어는 영어. */
export function summaryLabels(language: SummaryLanguage = "ko"): SummaryLabels {
  return LABELS[language] ?? ENGLISH_LABELS;
}
