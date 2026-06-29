import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import { Id } from "./_generated/dataModel";
import schema from "./schema";
import { api } from "./_generated/api";

function initTest() {
  const modules = import.meta.glob("./**/*.*s");
  return convexTest(schema, modules);
}

async function fetchUser(t: ReturnType<typeof initTest>, userId: string) {
  const tWithIdentity = t.withIdentity({ tokenIdentifier: userId, subject: userId });
  return await tWithIdentity.query(api.functions.getUser, { tokenIdentifier: userId });
}

async function captureTask(t: ReturnType<typeof initTest>, userId: string, rawCapture: string) {
  const tWithIdentity = t.withIdentity({ tokenIdentifier: userId, subject: userId });
  return await tWithIdentity.mutation(api.functions.createTask, { rawCapture });
}

async function setupUserAndOrg(t: ReturnType<typeof initTest>, userId: string, orgIdStr: string) {
  const orgId = await t.run(async (ctx) => {
    const id = await ctx.db.insert("organizations", {
      workosOrgId: orgIdStr,
      billingTier: "pro",
    });
    await ctx.db.insert("users", {
      tokenIdentifier: userId,
      orgId: id,
      role: "admin",
    });
    return id;
  });
  return orgId;
}

async function performSyncUser(t: ReturnType<typeof initTest>, userId: string, workosOrgId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tWithIdentity = t.withIdentity({ tokenIdentifier: userId, subject: userId, org_id: workosOrgId } as any);
  return await tWithIdentity.mutation(api.functions.syncUser, {
    tokenIdentifier: userId,
  });
}

describe("tasks", () => {
  it("should throw an error when creating a task unauthenticated", async () => {
    const t = initTest();

    // Action: Create a task without identity
    const promise = t.mutation(api.functions.createTask, { rawCapture: "Test task" });
    await expect(promise).rejects.toThrow(
      "Unauthenticated call to createTask",
    );
  });

  it("should throw an error when user is authenticated but not found in the database", async () => {
    const t = initTest();

    // Setup: Use an identity that doesn't correspond to any user in the db
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "nonexistent_user", subject: "nonexistent_user" });

    // Action: Create a task
    const promise = tWithIdentity.mutation(api.functions.createTask, { rawCapture: "Test task" });

    // Validation: Check that it throws an error
    await expect(promise).rejects.toThrow("User not found");
  });


  it("should throw an error when rawCapture exceeds the maximum length", async () => {
    const t = initTest();

    // Setup: Create an org and user
    await setupUserAndOrg(t, "user_length", "org_length");

    // Action: Create a task with a massive rawCapture string
    const longString = "a".repeat(4097);
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_length", subject: "user_length" });
    const promise = tWithIdentity.mutation(api.functions.createTask, { rawCapture: longString });

    // Validation: Check that it throws an error
    await expect(promise).rejects.toThrow("rawCapture exceeds maximum length of 4096 characters");
  });

  it("should create and list tasks", async () => {
    const t = initTest();

    // Setup: Create a test organization and user
    const orgId = await setupUserAndOrg(t, "user_123", "org_123");

    // Action: Create a task
    await captureTask(t, "user_123", "Test task");

    // Validation: List tasks
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123", subject: "user_123" });
    const tasks = await tWithIdentity.query(api.functions.listTasks, { orgId, paginationOpts: { numItems: 10, cursor: null } });
    expect(tasks.page).toHaveLength(1);
    expect(tasks.page[0].rawCapture).toBe("Test task");
    expect(tasks.page[0].status).toBe("active");
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
    await expect(t.mutation(api.functions.syncUser, { tokenIdentifier: "user_unauth" })).rejects.toThrow("Unauthenticated call to syncUser");
  });

  it("should throw an error when syncing a user with mismatched tokenIdentifier", async () => {
    const t = initTest();

    // Action: Sync a user with different tokenIdentifier than identity
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_authorized", subject: "user_authorized" });
    await expect(tWithIdentity.mutation(api.functions.syncUser, { tokenIdentifier: "user_other" })).rejects.toThrow("Unauthorized to sync this user");
  });

  it("should throw an error when completing a task unauthenticated", async () => {
    const t = initTest();

    // Setup: Create an org, user, and task
    await setupUserAndOrg(t, "user_123", "org_123");
    const taskId = await captureTask(t, "user_123", "Test task");

    // Action: Complete a task without identity
    await expect(t.mutation(api.functions.completeTask, { taskId })).rejects.toThrow("Unauthenticated call to completeTask");
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
    const tWithIdentity2 = t.withIdentity({ tokenIdentifier: "user_2", subject: "user_2" });
    await expect(tWithIdentity2.mutation(api.functions.completeTask, { taskId })).rejects.toThrow("Unauthorized to access this task");
  });

  it("should complete a task when authenticated and authorized", async () => {
    const t = initTest();

    // Setup: Create an org, user, and task
    const orgId = await setupUserAndOrg(t, "user_123", "org_123");
    const taskId = await captureTask(t, "user_123", "Test task");

    // Action: Complete the task
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123", subject: "user_123" });
    await tWithIdentity.mutation(api.functions.completeTask, { taskId });

    // Validation: Check task status
    const tasks = await tWithIdentity.query(api.functions.listTasks, { orgId, paginationOpts: { numItems: 10, cursor: null } });
    // listTasks only returns active tasks now, so it should be empty
    expect(tasks.page).toHaveLength(0);

    // Verify the task was actually completed by querying the DB directly
    await t.run(async (ctx) => {
      const dbTasks = await ctx.db.query("tasks").withIndex("by_orgId", (q) => q.eq("orgId", orgId)).collect();
      expect(dbTasks).toHaveLength(1);
      expect(dbTasks[0].status).toBe("completed");
    });
  });


  it("should throw an error when completing a task that is not found", async () => {
    const t = initTest();

    // Setup: Create an org and user
    await setupUserAndOrg(t, "user_not_found", "org_not_found");
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_not_found", subject: "user_not_found" });

    // Action: Create a task and then delete it directly from the database
    const taskId = await tWithIdentity.mutation(api.functions.createTask, { rawCapture: "Test task to delete" });
    await t.run(async (ctx) => {
      await ctx.db.delete(taskId);
    });

    // Validation: Try to complete the deleted task
    await expect(tWithIdentity.mutation(api.functions.completeTask, { taskId })).rejects.toThrow("Task not found");
  });

  it("should throw an error when completing a non-existent task", async () => {
    const t = initTest();

    // Setup: Create an org and user
    await setupUserAndOrg(t, "user_nonexistent", "org_nonexistent");

    // Action: Try to complete a task that doesn't exist using a syntactically valid ID format
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_nonexistent", subject: "user_nonexistent" });
    const fakeId = "jd10wtp2eb15a2h7z1s7c0b050m7";
    await expect(tWithIdentity.mutation(api.functions.completeTask, { taskId: fakeId as Id<"tasks"> })).rejects.toThrow("Validator error: Expected ID for table");
  });

  it("should throw an error when listing tasks from a different org", async () => {
    const t = initTest();

    // Setup: Create org 1 and user 1
    const orgId1 = await setupUserAndOrg(t, "user_1", "org_1");

    // Setup: Create org 2 and user 2
    await setupUserAndOrg(t, "user_2", "org_2");

    // Action: User 2 tries to list User 1's tasks
    const tWithIdentity2 = t.withIdentity({ tokenIdentifier: "user_2", subject: "user_2" });
    await expect(tWithIdentity2.query(api.functions.listTasks, { orgId: orgId1, paginationOpts: { numItems: 10, cursor: null } })).rejects.toThrow("Unauthorized");
  });

  it("should throw an error when getting a user unauthenticated", async () => {
    const t = initTest();

    // Action: Get a user without identity
    await expect(t.query(api.functions.getUser, { tokenIdentifier: "user_unauth" })).rejects.toThrow("Unauthenticated call to getUser");
  });

  it("should throw an error when getting a different user's profile", async () => {
    const t = initTest();

    // Action: Get a user with different tokenIdentifier than identity
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_actual", subject: "user_actual" });
    await expect(tWithIdentity.query(api.functions.getUser, { tokenIdentifier: "user_other" })).rejects.toThrow("Unauthorized to access this user");
  });
});
