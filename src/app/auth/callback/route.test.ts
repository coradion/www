import { describe, it, expect, vi } from 'vitest';
import { handleAuth } from '@workos-inc/authkit-nextjs';
import { GET } from './route';

vi.mock('@workos-inc/authkit-nextjs', () => ({
  handleAuth: vi.fn(() => 'mock-handle-auth-response'),
}));

describe('Auth Callback API Route', () => {
  it('should export the result of handleAuth as GET', () => {
    // Assert that handleAuth was called during module evaluation
    expect(handleAuth).toHaveBeenCalled();
    // Assert that GET has the value returned by handleAuth
    expect(GET).toBe('mock-handle-auth-response');
  });
});
