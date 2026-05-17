"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const [captureText, setCaptureText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user handling: sync a test user to get their user ID and org ID
  const syncUser = useMutation(api.functions.syncUser);
  const user = useQuery(api.functions.getUser, { tokenIdentifier: "mock-user-123" });

  useEffect(() => {
    if (user === null) {
      // Create user if they don't exist
      syncUser({
        tokenIdentifier: "mock-user-123",
        workosOrgId: "mock-org-123",
      }).catch(console.error);
    }
  }, [user, syncUser]);

  const createTask = useMutation(api.functions.createTask);

  const handleCapture = async () => {
    // If not using real auth yet, allow submission even if user isn't loaded completely
    // Let convex test setup handle the rest if mock user isn't ready
    if (!captureText.trim()) return;

    setIsSubmitting(true);
    try {
      if (user) {
        await createTask({
          orgId: user.orgId,
          userId: user._id,
          rawCapture: captureText.trim(),
        });
        setCaptureText("");
      }
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsSubmitting(false);
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
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Eudemonic Tasks
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Aligning effort with your neurobiology.
          </p>
        </header>

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

        <footer className="text-sm text-zinc-500 dark:text-zinc-600 text-center mt-8">
          Built with eudemonic principles in mind.
        </footer>
      </main>
    </div>
  );
}
