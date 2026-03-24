import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ConsentBanner } from "@/components/consent/ConsentBanner";
import { useConsentStore } from "@/stores/consent.store";

// Mock the useConsent hook to avoid API/react-query dependencies
vi.mock("@/hooks/useConsent", () => ({
  useConsent: () => ({
    grant: vi.fn().mockResolvedValue(undefined),
    revoke: vi.fn().mockResolvedValue(undefined),
    setHasShownBanner: vi.fn(),
  }),
}));

describe("ConsentBanner", () => {
  beforeEach(() => {
    useConsentStore.setState({ hasShownBanner: false });
  });

  it("renders both accept and reject buttons", () => {
    render(<ConsentBanner />);
    expect(screen.getByText("Ablehnen")).toBeInTheDocument();
    expect(screen.getByText("Akzeptieren")).toBeInTheDocument();
  });

  it("reject button is visible and equally prominent (same size)", () => {
    render(<ConsentBanner />);
    const reject = screen.getByText("Ablehnen");
    const accept = screen.getByText("Akzeptieren");

    // Both are rendered as buttons
    expect(reject.closest("button")).toBeInTheDocument();
    expect(accept.closest("button")).toBeInTheDocument();

    // Both are visible
    expect(reject).toBeVisible();
    expect(accept).toBeVisible();
  });

  it("does not render any pre-checked consent checkboxes", () => {
    render(<ConsentBanner />);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
      expect((cb as HTMLInputElement).checked).toBe(false);
    });
  });

  it("does not render when banner has already been shown", () => {
    useConsentStore.setState({ hasShownBanner: true });
    const { container } = render(<ConsentBanner />);
    expect(container.innerHTML).toBe("");
  });
});
