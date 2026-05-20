import re

with open('convex/functions.test.ts', 'r') as f:
    content = f.read()

# Replace createTask call
old_test = """  it("should create and list tasks", async () => {
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
  });"""

new_test = """  it("should create and list tasks", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Setup: Create a test organization and user
    // @ts-expect-error - vitest environment
    const orgId = await t.mutation(testSetupOrg, { workosOrgId: "org_123", billingTier: "pro" });
    // @ts-expect-error - vitest environment
    const userId = await t.mutation(testSetupUser, { tokenIdentifier: "user_123", orgId, role: "admin" });

    // Action: Create a task
    const tWithIdentity = t.withIdentity({ tokenIdentifier: "user_123" });
    // @ts-expect-error - vitest environment
    await tWithIdentity.mutation(createTask, { rawCapture: "Test task" });

    // Validation: List tasks
    // @ts-expect-error - vitest environment
    const tasks = await t.query(listTasks, { orgId });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].rawCapture).toBe("Test task");
    expect(tasks[0].status).toBe("active");
  });"""

if old_test in content:
    content = content.replace(old_test, new_test)
    with open('convex/functions.test.ts', 'w') as f:
        f.write(content)
    print("Updated functions.test.ts")
else:
    print("Could not find old test")
