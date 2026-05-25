import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const listTasks = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user || user.orgId !== args.orgId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db
      .query("tasks")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});

export const createTask = mutation({
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
});

export const testSetupOrg = internalMutation({
  args: { workosOrgId: v.string(), billingTier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("organizations", {
      workosOrgId: args.workosOrgId,
      billingTier: args.billingTier,
    });
  },
});

export const testSetupUser = internalMutation({
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
  args: { tokenIdentifier: v.string(), workosOrgId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to syncUser");
    }
    if (identity.tokenIdentifier !== args.tokenIdentifier) {
      throw new Error("Unauthorized to sync this user");
    }

    const orgIdToUse = args.workosOrgId ?? args.tokenIdentifier;

    let org = await ctx.db
      .query("organizations")
      .withIndex("by_workosOrgId", (q) => q.eq("workosOrgId", orgIdToUse))
      .unique();

    if (!org) {
      const orgId = await ctx.db.insert("organizations", {
        workosOrgId: orgIdToUse,
        billingTier: "free",
      });
      org = {
        _id: orgId,
        _creationTime: Date.now(),
        workosOrgId: orgIdToUse,
        billingTier: "free",
      };
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to getUser");
    }
    if (identity.tokenIdentifier !== args.tokenIdentifier) {
      throw new Error("Unauthorized to access this user");
    }

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .unique();
  },
});

export const completeTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.taskId, { status: "completed" });
  },
});
