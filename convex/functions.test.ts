import { describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { listTasks, createTask, testSetupOrg, testSetupUser, syncUser, getUser } from "./functions";

describe("tasks", () => {
  it("should create and list tasks", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);
    
    // Setup: Create a test organization and user
    // @ts-expect-error - vitest environment
    const orgId = await t.mutation(testSetupOrg, { workosOrgId: "org_123", billingTier: "pro" });
    // @ts-expect-error - vitest environment
    const userId = await t.mutation(testSetupUser, { tokenIdentifier: "user_123", orgId, role: "admin" });

    // Action: Create a task
    // @ts-expect-error - vitest environment
    await t.mutation(createTask, { orgId, userId, rawCapture: "Test task" });

    // Validation: List tasks
    // @ts-expect-error - vitest environment
    const tasks = await t.query(listTasks, { orgId });
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
    // @ts-expect-error - vitest environment
    const user = await t.query(getUser, { tokenIdentifier: "user_abc" });
    expect(user).not.toBeNull();
    expect(user?.tokenIdentifier).toBe("user_abc");
    
    // Check organization was created/linked
    expect(user?.orgId).toBeDefined();
  });
});
