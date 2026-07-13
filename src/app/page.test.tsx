import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "./page";
import { describe, it, expect, vi } from "vitest";
import * as authKitComponents from "@workos-inc/authkit-nextjs/components";
import { usePaginatedQuery, useMutation } from "convex/react";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} data-testid="next-image" />;
  },
}));


vi.mock("@workos-inc/authkit-nextjs/components", () => ({
  useAuth: vi.fn(() => ({
    user: null,
    organizationId: undefined,
    signOut: vi.fn(),
    getAuth: vi.fn(),
    refreshAuth: vi.fn()
  }))
}));

vi.mock("next/link", () => {
    return {
        default: (props: { href: string; children: React.ReactNode }) => {
            return <a href={props.href}>{props.children}</a>;
        }
    }
});

vi.mock("convex/react", async (importOriginal) => {
  const actual = await importOriginal() as Record<string, unknown>;
  return {
    ...actual,
    usePaginatedQuery: vi.fn(() => {
      return { results: [], status: "Exhausted", loadMore: vi.fn() };
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useQuery: vi.fn((query: any) => {
      try {
         // Try to return an array if the query isn't getUser
         if (query.isRegistered && query.isRegistered === false) {
             // Usually api.functions.getUser has this shape.
             // We'll just check if it returns a user or an array
         }
      } catch (error) {
        console.error("Error in useQuery mock:", error);
      }

      // Let's just return a magic object that has filter on it, just in case
      // Or an array that also has _id so it works for both!
      const res: unknown[] & { _id?: string; orgId?: string } = [];
      res._id = "user-id";
      res.orgId = "org-id";
      return res;
    }),

    useMutation: vi.fn(() => vi.fn()),
    useConvexAuth: vi.fn(() => ({ isAuthenticated: false })),
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

  it("renders the default User icon when user is logged in but has no profilePictureUrl", () => {
    const useAuthSpy = vi.spyOn(authKitComponents, "useAuth");
    useAuthSpy.mockReturnValue({
      user: { id: "user-123", email: "test@example.com", profilePictureUrl: null } as unknown as ReturnType<typeof authKitComponents.useAuth>,
      organizationId: undefined,
      signOut: vi.fn(),
      getAuth: vi.fn() as unknown,
      refreshAuth: vi.fn() as unknown,
    } as unknown as ReturnType<typeof authKitComponents.useAuth>);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<Home />);

    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();

    // The lucide User icon should be present, but Image should not
    const image = screen.queryByTestId("next-image");
    expect(image).not.toBeInTheDocument();

    // check for the User SVG. It has the class "text-zinc-500" from our implementation
    const svgIcon = container.querySelector('svg.lucide-user');
    expect(svgIcon).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it("renders the user's profile picture using Image when profilePictureUrl is present", () => {
    const useAuthSpy = vi.spyOn(authKitComponents, "useAuth");
    useAuthSpy.mockReturnValue({
      user: { id: "user-123", email: "test@example.com", profilePictureUrl: "https://example.com/avatar.png" } as unknown as ReturnType<typeof authKitComponents.useAuth>,
      organizationId: undefined,
      signOut: vi.fn(),
      getAuth: vi.fn() as unknown,
      refreshAuth: vi.fn() as unknown,
    } as unknown as ReturnType<typeof authKitComponents.useAuth>);

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Home />);

    expect(screen.getByText(/Sign out/i)).toBeInTheDocument();

    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/avatar.png");
    expect(image).toHaveAttribute("alt", "Profile picture");

    consoleSpy.mockRestore();
  });

  it("sets error state when completing a task fails", async () => {
    const useAuthSpy = vi.spyOn(authKitComponents, "useAuth");
    useAuthSpy.mockReturnValue({
      user: { id: "user-123", email: "test@example.com" } as unknown as ReturnType<typeof authKitComponents.useAuth>,
      organizationId: undefined,
      signOut: vi.fn(),
      getAuth: vi.fn() as unknown,
      refreshAuth: vi.fn() as unknown,
    } as unknown as ReturnType<typeof authKitComponents.useAuth>);

    vi.mocked(usePaginatedQuery).mockReturnValueOnce({
      results: [{ _id: "task-1", rawCapture: "Test task to complete" }],
      status: "Exhausted",
      loadMore: vi.fn()
    } as unknown as ReturnType<typeof usePaginatedQuery>);

    vi.mocked(useMutation).mockImplementation(() => {
        return vi.fn().mockRejectedValue(new Error("Failed to complete task")) as unknown as ReturnType<typeof useMutation>;
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Home />);

    const completeBtn = screen.getByLabelText("Complete task");
    fireEvent.click(completeBtn);

    await waitFor(() => {
        expect(screen.getByText("Failed to complete task")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it("sets error state when creating a task fails", async () => {
    const useAuthSpy = vi.spyOn(authKitComponents, "useAuth");
    useAuthSpy.mockReturnValue({
      user: { id: "user-123", email: "test@example.com" } as unknown as ReturnType<typeof authKitComponents.useAuth>,
      organizationId: undefined,
      signOut: vi.fn(),
      getAuth: vi.fn() as unknown,
      refreshAuth: vi.fn() as unknown,
    } as unknown as ReturnType<typeof authKitComponents.useAuth>);

    vi.mocked(useMutation).mockImplementation(() => {
        return vi.fn().mockRejectedValue(new Error("Failed to create task")) as unknown as ReturnType<typeof useMutation>;
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<Home />);

    const input = screen.getByPlaceholderText("What's on your mind? (TEA Framework)");
    fireEvent.change(input, { target: { value: 'New test task' } });

    const captureBtn = screen.getByText("Capture");
    fireEvent.click(captureBtn);

    await waitFor(() => {
        expect(screen.getByText("Failed to create task")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

});
