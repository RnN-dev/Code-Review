import { describe, expect, it } from "vitest";
import {
  isReviewStreamComplete,
  REVIEW_DONE_MARKER,
  stripReviewDoneMarker,
} from "./review-stream";

describe("review stream helpers", () => {
  it("detects the explicit completion marker", () => {
    expect(isReviewStreamComplete(`## Bugs\nOk\n${REVIEW_DONE_MARKER}`)).toBe(true);
    expect(isReviewStreamComplete("## Bugs\nOk")).toBe(false);
  });

  it("removes the marker before rendering markdown", () => {
    expect(stripReviewDoneMarker(`## Bugs\nOk\n${REVIEW_DONE_MARKER}`)).toBe(
      "## Bugs\nOk",
    );
  });
});
