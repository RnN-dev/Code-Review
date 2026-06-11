export const REVIEW_DONE_MARKER = "<!-- REVIEW_DONE -->";

export function isReviewStreamComplete(markdown: string) {
  return markdown.includes(REVIEW_DONE_MARKER);
}

export function stripReviewDoneMarker(markdown: string) {
  return markdown.replace(REVIEW_DONE_MARKER, "").trim();
}
