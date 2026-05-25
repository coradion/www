import { render, screen } from "@testing-library/react";
import Home from "./page";
import { describe, it, expect, vi } from "vitest";


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
    useQuery: vi.fn((query) => {
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
});
