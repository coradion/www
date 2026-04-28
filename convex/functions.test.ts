import { vitest, describe, it, expect } from "vitest";
import { convexTest } from "convex-test";
import schema from "./schema";
import { listTasks, createTask, testSetupOrg, testSetupUser } from "./functions";

describe("tasks", () => {
  it("should create and list tasks", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);
    
    // Setup: Create a test organization and user
    const orgId = await t.mutation(testSetupOrg, { workosOrgId: "org_123", billingTier: "pro" });
    const userId = await t.mutation(testSetupUser, { tokenIdentifier: "user_123", orgId, role: "admin" });

    // Action: Create a task
    await t.mutation(createTask, { orgId, userId, rawCapture: "Test task" });

    // Validation: List tasks
    const tasks = await t.query(listTasks, { orgId });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].rawCapture).toBe("Test task");
    expect(tasks[0].status).toBe("inbox");
  });
});
