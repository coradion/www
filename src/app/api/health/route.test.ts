import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('Health Check API', () => {
  it('should return a 200 response with no body', async () => {
    const response = await GET();

    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe('');
  });
});
