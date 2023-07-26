import { vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import flushPromises from "flush-promises";

vi.mock("@/services/currentProgress", () => ({
  default: vi.fn().mockResolvedValue({
    courses: [
      {
        id: "1",
        name: "Started course",
        enabled: true,
        type: "course",
        progress: {
          startedAt: 1,
          finishedAt: null,
        },
      },
    ],
    wordsToRepeat: 2,
  }),
}));

vi.mock("@/utils/UidHook.ts", () => ({
  default: vi.fn().mockReturnValue(() => "123"),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  Link: (props: any) => <span>{props.children}</span>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockReturnValue({ t: (x: any) => x }),
}));

import Subject from "@/pages/Home";

describe("HomePage", () => {
  it("renders without error", async () => {
    const wrapper = render(<Subject />);
    expect(
      wrapper.container.querySelectorAll('[class^="placeholder"]').length
    ).toBeGreaterThan(0);
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByText(/HomePage.title/i)).toBeDefined();
  });
  it("shows words to repeat", async () => {
    render(<Subject />);
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByText(/HomePage.repeat.action/i)).toBeDefined();
  });
  it("shows courses to continue", async () => {
    render(<Subject />);
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByText(/HomePage.unstarted.action/i)).toBeDefined();
  });
});
