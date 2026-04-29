import { render, screen } from "@testing-library/react";
import Home from "./page";
import { describe, it, expect, vi } from "vitest";

describe("Home Page", () => {
  it("renders successfully and displays expected content", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    render(<Home />);
    
    expect(screen.getByText(/Eudemonic Tasks/i)).toBeInTheDocument();
    expect(consoleSpy).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
