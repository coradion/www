import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConvexClientProvider } from './ConvexClientProvider';
import React from 'react';

// Mock dependencies
vi.mock('convex/react', () => {
  return {
    ConvexReactClient: vi.fn(),
    ConvexProviderWithAuth: ({ children }: { children: React.ReactNode }) => <div data-testid="convex-provider-with-auth">{children}</div>,
  };
});

vi.mock('@workos-inc/authkit-nextjs/components', () => {
  return {
    AuthKitProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="auth-kit-provider">{children}</div>,
    useAuth: vi.fn(() => ({ user: null, loading: false })),
    useAccessToken: vi.fn(() => ({ getAccessToken: vi.fn(), refresh: vi.fn() })),
  };
});

describe('ConvexClientProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clone env before each test to prevent test cross-contamination
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore env
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('renders successfully when NEXT_PUBLIC_CONVEX_URL is defined', () => {
    process.env.NEXT_PUBLIC_CONVEX_URL = 'http://localhost:3001';

    const { getByTestId } = render(
      <ConvexClientProvider>
        <div>Test Child</div>
      </ConvexClientProvider>
    );

    expect(getByTestId('auth-kit-provider')).toBeInTheDocument();
    expect(getByTestId('convex-provider-with-auth')).toBeInTheDocument();
  });

  it('throws an error when NEXT_PUBLIC_CONVEX_URL is not defined', () => {
    delete process.env.NEXT_PUBLIC_CONVEX_URL;

    // We need to catch the error thrown during render
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(
        <ConvexClientProvider>
          <div>Test Child</div>
        </ConvexClientProvider>
      );
    }).toThrow('NEXT_PUBLIC_CONVEX_URL environment variable is not defined');

    consoleError.mockRestore();
  });
});
