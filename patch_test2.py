import re

with open('convex/functions.test.ts', 'r') as f:
    content = f.read()

# Add unauthenticated test
old_test = """  it("should create and list tasks", async () => {"""

new_test = """  it("should throw an error when creating a task unauthenticated", async () => {
    const modules = import.meta.glob("./**/*.*s");
    const t = convexTest(schema, modules);

    // Action: Create a task without identity
    // @ts-expect-error - vitest environment
    await expect(t.mutation(createTask, { rawCapture: "Test task" })).rejects.toThrow("Unauthenticated call to createTask");
  });

  it("should create and list tasks", async () => {"""

if old_test in content:
    content = content.replace(old_test, new_test)
    with open('convex/functions.test.ts', 'w') as f:
        f.write(content)
    print("Updated functions.test.ts")
else:
    print("Could not find old test")
