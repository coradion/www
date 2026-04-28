# Implementation Plan: Switch to pnpm

## Phase 1: Migration Setup [checkpoint: 18060e2]
- [x] Task: Create migration verification script (de0802d)
    - [ ] Write a script to check for `pnpm-lock.yaml` and absence of `package-lock.json`
- [x] Task: Conductor - User Manual Verification 'Phase 1: Migration Setup' (18060e2)

## Phase 2: Execution
- [x] Task: Remove legacy artifacts (2faf942)
    - [ ] Delete `package-lock.json`
    - [ ] Delete `node_modules`
- [ ] Task: Initialize pnpm
    - [ ] Run `pnpm install`
- [ ] Task: Verify build integrity
    - [ ] Run `pnpm run build` using pnpm
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Execution' (Protocol in workflow.md)
