import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { getSignInUrl } from '@workos-inc/authkit-nextjs';
import { redirect } from 'next/navigation';

vi.mock('@workos-inc/authkit-nextjs', () => ({
  getSignInUrl: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Sign In API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should redirect to the sign in url on success', async () => {
    const mockUrl = 'https://example.com/sign-in';
    vi.mocked(getSignInUrl).mockResolvedValue(mockUrl);
    vi.mocked(redirect).mockReturnValue('mock-redirect-response' as never);

    const response = await GET();

    expect(getSignInUrl).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith(mockUrl);
    expect(response).toBe('mock-redirect-response');
  });

  it('should propagate errors from getSignInUrl', async () => {
    const mockError = new Error('Failed to generate sign-in URL');
    vi.mocked(getSignInUrl).mockRejectedValue(mockError);

    await expect(GET()).rejects.toThrow('Failed to generate sign-in URL');
    expect(redirect).not.toHaveBeenCalled();
  });
});
