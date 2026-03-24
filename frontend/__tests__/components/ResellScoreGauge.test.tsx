import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ResellScoreGauge } from "@/components/insights/ResellScoreGauge";

describe("ResellScoreGauge", () => {
  it("renders the score value", () => {
    render(<ResellScoreGauge score={85} />);
    expect(screen.getByText("85")).toBeInTheDocument();
  });

  it("applies green color class for high score (>= 70)", () => {
    render(<ResellScoreGauge score={75} />);
    const scoreEl = screen.getByText("75");
    expect(scoreEl.className).toContain("text-score-green");
  });

  it("shows 'Banger' label for high score", () => {
    render(<ResellScoreGauge score={80} />);
    expect(screen.getByText("Banger")).toBeInTheDocument();
  });

  it("applies yellow color class for mid score (40-69)", () => {
    render(<ResellScoreGauge score={55} />);
    const scoreEl = screen.getByText("55");
    expect(scoreEl.className).toContain("text-score-yellow");
  });

  it("shows 'Okay' label for mid score", () => {
    render(<ResellScoreGauge score={50} />);
    expect(screen.getByText("Okay")).toBeInTheDocument();
  });

  it("applies red color class for low score (< 40)", () => {
    render(<ResellScoreGauge score={20} />);
    const scoreEl = screen.getByText("20");
    expect(scoreEl.className).toContain("text-score-red");
  });

  it("shows 'Ladenhueter' label for low score", () => {
    render(<ResellScoreGauge score={15} />);
    expect(screen.getByText("Ladenhueter")).toBeInTheDocument();
  });
});
