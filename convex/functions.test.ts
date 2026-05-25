import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import {
  listTasks,
  createTask,
  testSetupOrg,
  testSetupUser,
  syncUser,
  getUser,
  completeTask,
} from "./functions";

function initTest() {
  const modules = import.meta.glob("./**/*.*s");
  return convexTest(schema, modules);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchUser(t: any, userId: string) {
  const tWithIdentity = t.withIdentity({ tokenIdentifier: userId });
  return await tWithIdentity.query(getUser, { tokenIdentifier: userId });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function captureTask(t: any, userId: string, rawCapture: string) {
  const tWithIdentity = t.withIdentity({ tokenIdentifier: userId });
  return await tWithIdentity.mutation(createTask, { rawCapture });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setupUserAndOrg(t: any, userId: string, orgIdStr: string) {
  const orgId = await t.mutation(testSetupOrg, {
    workosOrgId: orgIdStr,
    billingTier: "pro",
  });
  await t.mutation(testSetupUser, {
    tokenIdentifier: userId,
    orgId,
    role: "admin",
  });
  return orgId;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function performSyncUser(t: any, userId: string, workosOrgId?: string) {
  const tWithIdentity = t.withIdentity({ tokenIdentifier: userId });
  return await tWithIdentity.mutation(syncUser, {
    tokenIdentifier: userId,
    workosOrgId,
  });
}

describe("tasks", () => {
  it("should throw an error when creating a task unauthenticated", async () => {
    const t = initTest();

    // Action: Create a task without identity
    // @ts-expect-error - vitest environment
    const promise = t.mutation(createTask, { rawCapture: "Test task" });
    await expect(promise).rejects.toThrow(
      "Unauthenticated call to createTask",
    );
  });

  it("should create and list tasks", async () => {
    const t = initTest();

    // Setup: Create a test organization and user
    const orgId = await setupUserAndOrg(t, "user_123", "org_123");

    // Action: Create a task
    await captureTask(t, "user_123", "Test task");

    // Validation: List tasks
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123" });
    // @ts-expect-error - vitest environment
    const tasks = await tWithIdentity.query(listTasks, { orgId });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].rawCapture).toBe("Test task");
    expect(tasks[0].status).toBe("active");
  });

  it("should sync and get user identity", async () => {
    const t = initTest();

    // Action: Sync a user (first time creates it)
    await performSyncUser(t, "user_abc", "org_abc");

    // Validation: Get user
    const user = await fetchUser(t, "user_abc");
    expect(user).not.toBeNull();
    expect(user?.tokenIdentifier).toBe("user_abc");

    // Check organization was created/linked
    expect(user?.orgId).toBeDefined();
  });

  it("should update user orgId when synced with a different org", async () => {
    const t = initTest();

    // Action 1: Sync user with first org
    await performSyncUser(t, "user_multi_org", "org_first");

    // Validation 1: Get user and store first orgId
    const user1 = await fetchUser(t, "user_multi_org");
    expect(user1).not.toBeNull();
    const firstOrgId = user1?.orgId;
    expect(firstOrgId).toBeDefined();

    // Action 2: Sync same user with second org
    await performSyncUser(t, "user_multi_org", "org_second");

    // Validation 2: Get user again and verify orgId changed
    const user2 = await fetchUser(t, "user_multi_org");
    expect(user2).not.toBeNull();
    expect(user2?.orgId).toBeDefined();
    expect(user2?.orgId).not.toBe(firstOrgId);
  });

  it("should sync and get user identity with optional workosOrgId fallback", async () => {
    const t = initTest();

    // Action: Sync a user without workosOrgId
    await performSyncUser(t, "user_personal");

    // Validation: Get user
    const user = await fetchUser(t, "user_personal");
    expect(user).not.toBeNull();
    expect(user?.tokenIdentifier).toBe("user_personal");
    expect(user?.orgId).toBeDefined();
  });

  it("should throw an error when syncing a user unauthenticated", async () => {
    const t = initTest();

    // Action: Sync a user without identity
    // @ts-expect-error - vitest environment
    await expect(t.mutation(syncUser, { tokenIdentifier: "user_unauth" })).rejects.toThrow("Unauthenticated call to syncUser");
  });

  it("should throw an error when syncing a user with mismatched tokenIdentifier", async () => {
    const t = initTest();

    // Action: Sync a user with different tokenIdentifier than identity
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_authorized" });
    // @ts-expect-error - vitest environment
    await expect(tWithIdentity.mutation(syncUser, { tokenIdentifier: "user_other" })).rejects.toThrow("Unauthorized to sync this user");
  });

  it("should throw an error when completing a task unauthenticated", async () => {
    const t = initTest();

    // Setup: Create an org, user, and task
    await setupUserAndOrg(t, "user_123", "org_123");
    const taskId = await captureTask(t, "user_123", "Test task");

    // Action: Complete a task without identity
    // @ts-expect-error - vitest environment
    await expect(t.mutation(completeTask, { taskId })).rejects.toThrow("Unauthenticated call to completeTask");
  });

  it("should throw an error when completing a task from a different org", async () => {
    const t = initTest();

    // Setup: Create org 1 and user 1
    await setupUserAndOrg(t, "user_1", "org_1");

    // Setup: Create org 2 and user 2
    await setupUserAndOrg(t, "user_2", "org_2");

    // User 1 creates a task
    const taskId = await captureTask(t, "user_1", "Test task org 1");

    // Action: User 2 tries to complete User 1's task
    const tWithIdentity2 = t.withIdentity({ tokenIdentifier: "user_2" });
    // @ts-expect-error - vitest environment
    await expect(tWithIdentity2.mutation(completeTask, { taskId })).rejects.toThrow("Unauthorized to access this task");
  });

  it("should complete a task when authenticated and authorized", async () => {
    const t = initTest();

    // Setup: Create an org, user, and task
    const orgId = await setupUserAndOrg(t, "user_123", "org_123");
    const taskId = await captureTask(t, "user_123", "Test task");

    // Action: Complete the task
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123" });
    // @ts-expect-error - vitest environment
    await tWithIdentity.mutation(completeTask, { taskId });

    // Validation: Check task status
    // @ts-expect-error - vitest environment
    const tasks = await tWithIdentity.query(listTasks, { orgId });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].status).toBe("completed");
  });
});
