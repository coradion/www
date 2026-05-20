import re

with open('convex/functions.test.ts', 'r') as f:
    content = f.read()

# Remove unused userId
old_test = """    // Setup: Create a test organization and user
    // @ts-expect-error - vitest environment
    const orgId = await t.mutation(testSetupOrg, { workosOrgId: "org_123", billingTier: "pro" });
    // @ts-expect-error - vitest environment
    const userId = await t.mutation(testSetupUser, { tokenIdentifier: "user_123", orgId, role: "admin" });"""

new_test = """    // Setup: Create a test organization and user
    // @ts-expect-error - vitest environment
    const orgId = await t.mutation(testSetupOrg, { workosOrgId: "org_123", billingTier: "pro" });
    // @ts-expect-error - vitest environment
    await t.mutation(testSetupUser, { tokenIdentifier: "user_123", orgId, role: "admin" });"""

if old_test in content:
    content = content.replace(old_test, new_test)
    with open('convex/functions.test.ts', 'w') as f:
        f.write(content)
    print("Updated functions.test.ts")
else:
    print("Could not find old test")
