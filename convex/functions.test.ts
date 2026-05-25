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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setupUserAndOrg(t: any, userId: string, orgIdStr: string) {
  // @ts-expect-error - vitest environment
  const orgId = await t.mutation(testSetupOrg, {
    workosOrgId: orgIdStr,
    billingTier: "pro",
  });
  // @ts-expect-error - vitest environment
  await t.mutation(testSetupUser, {
    tokenIdentifier: userId,
    orgId,
    role: "admin",
  });
  return orgId;
}

describe("tasks", () => {
  it("should throw an error when creating a task unauthenticated", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Action: Create a task without identity
    // @ts-expect-error - vitest environment
    const promise = t.mutation(createTask, { rawCapture: "Test task" });
    await expect(promise).rejects.toThrow(
      "Unauthenticated call to createTask",
    );
  });

  it("should create and list tasks", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Setup: Create a test organization and user
    const orgId = await setupUserAndOrg(t, "user_123", "org_123");
    const userAuth = t.withIdentity({ tokenIdentifier: "user_123" });

    // Action: Create a task
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123" });
    // @ts-expect-error - vitest environment
    await tWithIdentity.mutation(createTask, { rawCapture: "Test task" });

    // Validation: List tasks
    // @ts-expect-error - vitest environment
    const tasks = await userAuth.query(listTasks, { orgId });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].rawCapture).toBe("Test task");
    expect(tasks[0].status).toBe("active");
  });

  it("should sync and get user identity", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Action: Sync a user (first time creates it)
    // @ts-expect-error - vitest environment
    await t.mutation(syncUser, {
      tokenIdentifier: "user_abc",
      workosOrgId: "org_abc",
    });

    // Validation: Get user
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_abc" });
    // @ts-expect-error - vitest environment
    const user = await tWithIdentity.query(getUser, {
      tokenIdentifier: "user_abc",
    });
    expect(user).not.toBeNull();
    expect(user?.tokenIdentifier).toBe("user_abc");

    // Check organization was created/linked
    expect(user?.orgId).toBeDefined();
  });

  it("should update user orgId when synced with a different org", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Action 1: Sync user with first org
    // @ts-expect-error - vitest environment
    await t.mutation(syncUser, {
      tokenIdentifier: "user_multi_org",
      workosOrgId: "org_first",
    });

    // Validation 1: Get user and store first orgId
    const tWithIdentity1 = t.withIdentity({
      tokenIdentifier: "user_multi_org",
    });
    // @ts-expect-error - vitest environment
    const user1 = await tWithIdentity1.query(getUser, {
      tokenIdentifier: "user_multi_org",
    });
    expect(user1).not.toBeNull();
    const firstOrgId = user1?.orgId;
    expect(firstOrgId).toBeDefined();

    // Action 2: Sync same user with second org
    // @ts-expect-error - vitest environment
    await t.mutation(syncUser, {
      tokenIdentifier: "user_multi_org",
      workosOrgId: "org_second",
    });

    // Validation 2: Get user again and verify orgId changed
    const tWithIdentity2 = t.withIdentity({
      tokenIdentifier: "user_multi_org",
    });
    // @ts-expect-error - vitest environment
    const user2 = await tWithIdentity2.query(getUser, {
      tokenIdentifier: "user_multi_org",
    });
    expect(user2).not.toBeNull();
    expect(user2?.orgId).toBeDefined();
    expect(user2?.orgId).not.toBe(firstOrgId);
  });

  it("should sync and get user identity with optional workosOrgId fallback", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Action: Sync a user without workosOrgId
    // @ts-expect-error - vitest environment
    await t.mutation(syncUser, {
      tokenIdentifier: "user_personal",
    });

    // Validation: Get user
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_personal" });
    // @ts-expect-error - vitest environment
    const user = await tWithIdentity.query(getUser, {
      tokenIdentifier: "user_personal",
    });
    expect(user).not.toBeNull();
    expect(user?.tokenIdentifier).toBe("user_personal");
    expect(user?.orgId).toBeDefined();
  });

  it("should throw an error when completing a task unauthenticated", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Setup: Create an org, user, and task
    await setupUserAndOrg(t, "user_123", "org_123");

    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123" });
    // @ts-expect-error - vitest environment
    const taskId = await tWithIdentity.mutation(createTask, { rawCapture: "Test task" });

    // Action: Complete a task without identity
    // @ts-expect-error - vitest environment
    await expect(t.mutation(completeTask, { taskId })).rejects.toThrow("Unauthenticated call to completeTask");
  });

  it("should throw an error when completing a task from a different org", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Setup: Create org 1 and user 1
    await setupUserAndOrg(t, "user_1", "org_1");

    // Setup: Create org 2 and user 2
    await setupUserAndOrg(t, "user_2", "org_2");

    // User 1 creates a task
    const tWithIdentity1 = t.withIdentity({ tokenIdentifier: "user_1" });
    // @ts-expect-error - vitest environment
    const taskId = await tWithIdentity1.mutation(createTask, { rawCapture: "Test task org 1" });

    // Action: User 2 tries to complete User 1's task
    const tWithIdentity2 = t.withIdentity({ tokenIdentifier: "user_2" });
    // @ts-expect-error - vitest environment
    await expect(tWithIdentity2.mutation(completeTask, { taskId })).rejects.toThrow("Unauthorized to access this task");
  });

  it("should complete a task when authenticated and authorized", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Setup: Create an org, user, and task
    const orgId = await setupUserAndOrg(t, "user_123", "org_123");

    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123" });
    // @ts-expect-error - vitest environment
    const taskId = await tWithIdentity.mutation(createTask, { rawCapture: "Test task" });

    // Action: Complete the task
    // @ts-expect-error - vitest environment
    await tWithIdentity.mutation(completeTask, { taskId });

    // Validation: Check task status
    // @ts-expect-error - vitest environment
    const tasks = await tWithIdentity.query(listTasks, { orgId });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].status).toBe("completed");
  });
});
