import re

with open('convex/functions.ts', 'r') as f:
    content = f.read()

# Replace createTask
old_createTask = """export const createTask = mutation({
  args: {
    orgId: v.id("organizations"),
    userId: v.id("users"),
    rawCapture: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      orgId: args.orgId,
      userId: args.userId,
      rawCapture: args.rawCapture,
      status: "active", // Updated to default to active for self-captured tasks as per spec,
      eisenhowerQuadrant: 2, // Default to Important/Not Urgent
      bentoSize: "medium",
      energyRequired: 5,
    });
    return taskId;
  },
});"""

new_createTask = """export const createTask = mutation({
  args: {
    rawCapture: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to createTask");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const taskId = await ctx.db.insert("tasks", {
      orgId: user.orgId,
      userId: user._id,
      rawCapture: args.rawCapture,
      status: "active", // Updated to default to active for self-captured tasks as per spec,
      eisenhowerQuadrant: 2, // Default to Important/Not Urgent
      bentoSize: "medium",
      energyRequired: 5,
    });
    return taskId;
  },
});"""

if old_createTask in content:
    content = content.replace(old_createTask, new_createTask)
    with open('convex/functions.ts', 'w') as f:
        f.write(content)
    print("Updated functions.ts")
else:
    print("Could not find old createTask")
