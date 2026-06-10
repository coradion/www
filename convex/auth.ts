import { AuthKit } from "@convex-dev/workos-authkit";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

export const authKit = new AuthKit<DataModel>(components.workOSAuthKit, {});

export const { authKitEvent } = authKit.events({
  "user.created": async (ctx, event) => {
    const tokenIdentifier = event.data.id;
    const workosOrgId = event.data.id;

    let org = await ctx.db
      .query("organizations")
      .withIndex("by_workosOrgId", (q) => q.eq("workosOrgId", workosOrgId))
      .unique();

    if (!org) {
      const orgId = await ctx.db.insert("organizations", {
        workosOrgId: workosOrgId,
        billingTier: "free",
      });
      org = await ctx.db.get(orgId);
    }

    if (org) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();

      if (!existingUser) {
        await ctx.db.insert("users", {
          tokenIdentifier: tokenIdentifier,
          orgId: org._id,
          role: "admin",
        });
      }
    }
  },
  "user.updated": async () => {
  },
  "user.deleted": async (ctx, event) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", event.data.id))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
  }
});
