import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('pnpm migration', () => {
  it('should have the verification script', () => {
    expect(existsSync(join(process.cwd(), 'scripts/verify-pnpm-migration.sh'))).toBe(true);
  });

  it('should have pnpm-lock.yaml', () => {
    expect(existsSync(join(process.cwd(), 'pnpm-lock.yaml'))).toBe(true);
  });

  it('should not have package-lock.json', () => {
    expect(existsSync(join(process.cwd(), 'package-lock.json'))).toBe(false);
  });
});
