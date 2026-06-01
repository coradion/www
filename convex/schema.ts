import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    workosOrgId: v.string(),
    billingTier: v.string(), // e.g., "pro", "enterprise"
  }).index("by_workosOrgId", ["workosOrgId"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    orgId: v.id("organizations"),
    role: v.string(), // e.g., "admin", "contributor"
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  tasks: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    rawCapture: v.string(),
    status: v.string(), // "inbox", "clarified", "active", "completed", "archived"
    eisenhowerQuadrant: v.number(), // 1-4
    bentoSize: v.string(), // "large", "medium", "small"
    energyRequired: v.number(), // estimated metabolic cost
  }).index("by_userId", ["userId"])
    .index("by_orgId", ["orgId"])
    .index("by_orgId_status", ["orgId", "status"]),
});
