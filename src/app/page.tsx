"use client";

import { Check, User, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, usePaginatedQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [captureText, setCaptureText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user: authUser, organizationId, signOut } = useAuth();
  const { isAuthenticated } = useConvexAuth();

  const syncUser = useMutation(api.functions.syncUser);
  const user = useQuery(
    api.functions.getUser,
    authUser ? { tokenIdentifier: authUser.id } : "skip",
  );

  // Query active tasks
  const { results: tasks } = usePaginatedQuery(
    api.functions.listTasks,
    user && isAuthenticated ? { orgId: user.orgId } : "skip",
    { initialNumItems: 10 }
  );
  const activeTasks = tasks ?? [];

  useEffect(() => {
    if (authUser && user === null) {
      // Create/sync user if they are logged in but don't exist in our db yet
      syncUser({
        tokenIdentifier: authUser.id,
        workosOrgId: organizationId || undefined,
      }).catch(() => setError("Failed to sync user profile. Please try refreshing."));
    }
  }, [user, authUser, syncUser, organizationId]);

  const createTask = useMutation(api.functions.createTask);
  const completeTask = useMutation(api.functions.completeTask);

  const handleCapture = async () => {
    if (!captureText.trim()) return;

    setIsSubmitting(true);
    try {
      if (user) {
        await createTask({
          rawCapture: captureText.trim(),
        });
        setCaptureText("");
      }
    } catch {
      setError("Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (taskId: Id<"tasks">) => {
    try {
      await completeTask({ taskId });
    } catch {
      setError("Failed to complete task");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCapture();
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <main className="flex flex-col w-full max-w-2xl gap-8">
        <header className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Eudemonic Tasks
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Aligning effort with your neurobiology.
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {authUser ? (
              <>
                <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                  {authUser.profilePictureUrl ? (
                    <Image
                      src={authUser.profilePictureUrl}
                      alt="Profile picture"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </header>

        {error && (
          <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-900/50">
            <span className="text-sm font-medium">{error}</span>
            <button
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              Quick Capture
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={captureText}
                onChange={(e) => setCaptureText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What's on your mind? (TEA Framework)"
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-zinc-500"
                disabled={isSubmitting}
              />
              <button
                onClick={handleCapture}
                disabled={isSubmitting || !captureText.trim()}
                className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black px-6 py-2 rounded-xl font-medium disabled:opacity-50"
              >
                {isSubmitting ? "Capturing..." : "Capture"}
              </button>
            </div>
          </div>
        </section>

        {activeTasks.length > 0 && (
          <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              Active Focus
            </h2>
            <ul className="flex flex-col gap-3">
              {activeTasks.map((task) => (
                <li
                  key={task._id}
                  className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/80"
                >
                  <span className="text-zinc-800 dark:text-zinc-200 text-lg">
                    {task.rawCapture}
                  </span>
                  <button
                    onClick={() => handleComplete(task._id)}
                    className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                    aria-label="Complete task"
                  >
                    <Check
                      className="w-4 h-4 text-transparent hover:text-green-500 transition-colors"
                      strokeWidth={3}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <footer className="text-sm text-zinc-500 dark:text-zinc-600 text-center mt-8">
          Built with eudemonic principles in mind.
        </footer>
      </main>
    </div>
  );
}
