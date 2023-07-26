import { vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import flushPromises from "flush-promises";
import ErrorHandler from "@/components/ErrorHandler";

vi.mock("@/services/currentProgress", () => ({
  default: vi.fn().mockResolvedValue({
    courses: [
      {
        id: "1",
        name: "Started course",
        enabled: true,
        type: "course",
        progress: {
          moduleId: '101',
          startedAt: 1,
          finishedAt: null,
        },
      },
    ],
    wordsToRepeat: 2,
  }),
}));
vi.mock("@/pages/Students/deleteCourseProgress", () => ({
  default: vi.fn().mockResolvedValue(null),
}));
vi.mock("@/services/users", () => ({
  findWithUid: vi.fn().mockResolvedValue({ name: "Student", uid: "123" }),
}));
vi.mock("@/utils/BusyHook", () => ({
  default: vi.fn().mockReturnValue(vi.fn()),
}));
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn().mockReturnValue("123"),
  Link: (props: any) => <span>{props.children}</span>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn().mockReturnValue({ t: (x: any) => x }),
}));

import Subject from "@/pages/Students/StudentPage";

describe("Students/StudentPage", () => {
  it("renders without error", async () => {
    const wrapper = render(
      <ErrorHandler>
        <Subject />
      </ErrorHandler>
    );
    expect(
      wrapper.container.querySelectorAll('[class^="placeholder"]').length
    ).toBeGreaterThan(0);
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByText(/StudentPage.title/i)).toBeDefined();
  });
  it("shows words to repeat", async () => {
    render(
      <ErrorHandler>
        <Subject />
      </ErrorHandler>
    );
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByText(/StudentPage.repeat/i)).toBeDefined();
  });
  it("shows words to repeat", async () => {
    window.confirm = vi.fn().mockReturnValue(true)
    render(
      <ErrorHandler>
        <Subject />
      </ErrorHandler>
    );
    await act(async () => {
      await flushPromises();
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await act(async () => {
      await flushPromises();
    });
    expect(screen.getByText(/StudentPage.table.empty/i)).toBeDefined();
  });
});
