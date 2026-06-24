import { describe, it, expect, vi } from 'vitest';
import { handleAuth } from '@workos-inc/authkit-nextjs';
import { GET } from './route';

vi.mock('@workos-inc/authkit-nextjs', () => ({
  handleAuth: vi.fn(() => vi.fn().mockResolvedValue('mock-response')),
}));

describe('Auth Callback API Route', () => {
  it('should export the result of handleAuth as GET', () => {
    expect(handleAuth).toHaveBeenCalled();
  });

  it('should mock a successful callback invocation', async () => {
    // Assert that GET strictly equals the value returned by handleAuth
    // When GET is called with a mock request, it processes appropriately.
    const mockRequest = new Request('http://localhost/auth/callback');

    // In WorkOS authkit nextjs, the route handler returns a function that takes a Request
    const result = await (GET as any)(mockRequest);
    expect(result).toBe('mock-response');
  });

  it('should propagate errors from the callback', async () => {
    const mockRequest = new Request('http://localhost/auth/callback');

    const mockErrorHandler = vi.fn().mockRejectedValue(new Error('Auth callback failed'));

    // We dynamically mock it for the error test
    vi.mocked(handleAuth).mockReturnValueOnce(mockErrorHandler as any);

    // Reload the module
    vi.resetModules();
    const { GET: DynamicGET } = await import('./route');

    await expect((DynamicGET as any)(mockRequest)).rejects.toThrow('Auth callback failed');
  });
});
