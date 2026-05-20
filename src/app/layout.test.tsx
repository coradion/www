import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RootLayout, { metadata } from "./layout";
import React from "react";

vi.mock("next/font/google", () => ({
  Spline_Sans: vi.fn().mockReturnValue({
    variable: "mock-spline-sans-variable",
  }),
}));


vi.mock("@workos-inc/authkit-nextjs/components", () => ({
  AuthKitProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-kit-provider">{children}</div>
  ),
}));

vi.mock("./ConvexClientProvider", () => ({
  ConvexClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="convex-client-provider">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders children wrapped in ConvexClientProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <RootLayout>
        <div data-testid="test-child">Child Content</div>
      </RootLayout>
    );

    const child = screen.getByTestId("test-child");
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Child Content");

    const provider = screen.getByTestId("convex-client-provider");
    expect(provider).toBeInTheDocument();
    expect(provider).toContainElement(child);

    consoleError.mockRestore();
  });

  it("applies correct HTML lang and CSS classes", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // React components are just functions. We can call it directly to inspect the returned React element
    // without passing it to `render`, bypassing JSDOM's parsing quirks for <html> elements.
    const element = RootLayout({ children: <div /> });

    // element is an <html> element
    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("en");
    expect(element.props.className).toContain("mock-spline-sans-variable h-full antialiased");

    // The child of <html> should be <body>
    const body = element.props.children;
    expect(body.type).toBe("body");
    expect(body.props.className).toContain("min-h-full flex flex-col font-sans");

    consoleError.mockRestore();
  });

  it("exports correct metadata", () => {
    expect(metadata).toEqual({
      title: "Eudemonic Task Management",
      description: "A system for human focus and well-being",
    });
  });
});
