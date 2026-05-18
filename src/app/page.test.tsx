import { render, screen } from "@testing-library/react";
import Home from "./page";
import { describe, it, expect, vi } from "vitest";

vi.mock("convex/react", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    useQuery: vi.fn(() => ({ _id: "user-id", orgId: "org-id" })),
    useMutation: vi.fn(() => vi.fn()),
  };
});

describe("Home Page", () => {
  it("renders successfully and displays expected content", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Create a minimal wrapper if needed or just render directly since hooks are mocked
    render(<Home />);
    
    expect(screen.getByText(/Eudemonic Tasks/i)).toBeInTheDocument();
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
