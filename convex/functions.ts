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
