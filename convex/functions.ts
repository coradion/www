import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listTasks = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createTask = mutation({
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
      status: "inbox",
      eisenhowerQuadrant: 2, // Default to Important/Not Urgent
      bentoSize: "medium",
      energyRequired: 5,
    });
    return taskId;
  },
});

export const testSetupOrg = mutation({
  args: { workosOrgId: v.string(), billingTier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("organizations", {
      workosOrgId: args.workosOrgId,
      billingTier: args.billingTier,
    });
  },
});

export const testSetupUser = mutation({
  args: { tokenIdentifier: v.string(), orgId: v.id("organizations"), role: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      orgId: args.orgId,
      role: args.role,
    });
  },
});

export const syncUser = mutation({
  args: { tokenIdentifier: v.string(), workosOrgId: v.string() },
  handler: async (ctx, args) => {
    let org = await ctx.db
      .query("organizations")
      .withIndex("by_workosOrgId", (q) => q.eq("workosOrgId", args.workosOrgId))
      .unique();

    if (!org) {
      const orgId = await ctx.db.insert("organizations", {
        workosOrgId: args.workosOrgId,
        billingTier: "free",
      });
      org = (await ctx.db.get(orgId))!;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();

    if (!user) {
      await ctx.db.insert("users", {
        tokenIdentifier: args.tokenIdentifier,
        orgId: org._id,
        role: "admin", // Default to admin for first user of org
      });
    } else if (user.orgId !== org._id) {
      await ctx.db.patch(user._id, { orgId: org._id });
    }
  },
});

export const getUser = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
  },
});
