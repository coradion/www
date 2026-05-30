
"use client";

import { Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import Link from "next/link";

export default function Home() {
  const [captureText, setCaptureText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user: authUser, signOut } = useAuth();
  const { isAuthenticated } = useConvexAuth();

  const syncUser = useMutation(api.functions.syncUser);
  const user = useQuery(
    api.functions.getUser,
    authUser ? { tokenIdentifier: authUser.id } : "skip",
  );

  // Query active tasks
  const tasks = useQuery(
    api.functions.listTasks,
    user && isAuthenticated ? { orgId: user.orgId } : "skip",
  );
  const activeTasks = tasks ?? [];

  useEffect(() => {
    if (authUser && user === null) {
      // Create/sync user if they are logged in but don't exist in our db yet
      syncUser({
        tokenIdentifier: authUser.id,
        // @ts-expect-error - missing orgId from typing
        workosOrgId: authUser.organizationId || undefined,
      }).catch(console.error);
    }
  }, [user, authUser, syncUser]);

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
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async (taskId: Id<"tasks">) => {
    try {
      await completeTask({ taskId });
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCapture();
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-surface-container-low z-[100]">
        <div className="h-full bg-sea-foam/40 w-2/3 shadow-[0_0_10px_rgba(147,233,190,0.5)]"></div>
      </div>

      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-gutter h-ultradian-rhythm bg-surface-container-low">
        <div className="flex items-center gap-4 hover:opacity-80 transition-opacity duration-200 cursor-pointer">
          <img alt="Coradion Logo" className="h-10 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMc4xAIk8Vgp8aRl3J9sK2-Nc-V7rQZ5w0-UOaukNvfnihwFH0sPaVjNIXZkpo0Yv3KGsouiggUXsgodMQyT2hWhPgdymcMnOxdP-TBiIf8JoXG0_FLNn17ZJ93q7C8ywZV_-f_d0vmcutqbZ9IL3SjILYCJpZt1QLz4vnR66xAPaN7p3NNN766JjC6lpaOk7RgVSen_6rU_GfqqrLeRumLL4j7_KSjSQmaJ6d78nzctanqJ27lgtRz9dCRHdrEbNZLnB57oEj03CH" />
          <span className="font-bold text-xl text-sea-foam tracking-tighter">Coradion</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-primary dark:text-tertiary-fixed font-bold border-b-2 border-primary px-2 py-1 transition-all duration-200 active:scale-[0.98]" href="#">Tasks</a>
          <a className="text-on-surface-variant font-normal hover:text-primary-fixed hover:bg-surface-variant/20 transition-all duration-200 active:scale-[0.98] px-2 py-1 rounded" href="#">Inbox</a>
          <a className="text-on-surface-variant font-normal hover:text-primary-fixed hover:bg-surface-variant/20 transition-all duration-200 active:scale-[0.98] px-2 py-1 rounded" href="#">Forecast</a>
          <a className="text-on-surface-variant font-normal hover:text-primary-fixed hover:bg-surface-variant/20 transition-all duration-200 active:scale-[0.98] px-2 py-1 rounded" href="#">History</a>
        </nav>
        <div className="relative group flex items-center gap-4 cursor-pointer">
          {authUser ? (
            <div className="flex items-center gap-4">
              <button onClick={() => signOut()} className="text-sm font-medium text-on-surface hover:text-sea-foam transition-colors">Sign out</button>
              <img alt="User Avatar" className="h-10 w-10 rounded-full object-cover border-2 border-primary/20 hover:border-primary/50 transition-colors duration-200" src={authUser.profilePictureUrl || "https://lh3.googleusercontent.com/aida/ADBb0ujjXJwJnZr0u_P2xvBD-X7m0f6VRDoQ1e5S9STwqPJoiqJZtspTEV7OMe59QMRcIlI8zI_otx8ObtgcO-YEvYa6mpTUv35ot13AESTfA6TiTp-TE0cKHXveCSgJIixVIxY-0V9XwP8ehid68Job9G1H_H4lyrQioUqrCuWOVIWVWSzbDywssiUdW4IAEk1WPgzOeftuj7Et33SLBc9P_U8OzKsN07Jnbb-HlGGKPyw7X7SKAqG1fz-w2d-_"} />
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-on-surface hover:text-sea-foam transition-colors">Sign in</Link>
              <Link href="/sign-up" className="text-sm font-medium text-on-surface hover:text-sea-foam transition-colors">Sign up</Link>
            </div>
          )}
          <span className="material-symbols-outlined text-on-surface-variant/60 text-sm" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pt-32 pb-24 px-gutter flex flex-col items-center">
        <section className="w-full mb-interruption-tax">
          <div className="bg-surface-container border border-outline/10 rounded-xl p-4 flex items-center gap-4 shadow-xl focus-within:border-primary/40 transition-colors duration-200">
            <span className="material-symbols-outlined text-sea-foam/60" data-icon="add_circle">add_circle</span>
            <input
              className="w-full bg-transparent border-none focus:ring-0 text-system-1-execution font-system-1-execution text-on-surface placeholder:text-sea-foam/30 transition-all duration-200"
              placeholder="What do you want to do?"
              type="text"
              value={captureText}
              onChange={(e) => setCaptureText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting || !user}
            />
            <button
              onClick={handleCapture}
              disabled={isSubmitting || !captureText.trim() || !user}
              className="bg-secondary-container text-on-secondary-container px-6 py-2 rounded-full font-label-caps text-label-caps hover:bg-secondary-container/80 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </section>

        <div className="w-full mb-4 flex justify-between items-end opacity-60">
          <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant text-sm font-semibold tracking-wider leading-relaxed">How much energy you need</span>
          <span className="font-monospaced-logic text-monospaced-logic text-sea-foam">14:24 Time</span>
        </div>

        <div className="w-full space-y-4">
          {activeTasks.map((task) => (
            <div key={task._id} className="group relative bg-surface-container border border-outline/10 p-6 rounded-xl hover:bg-surface-container-high transition-all duration-200 active:scale-[0.98] cursor-pointer flex justify-between items-center">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-momentum-green"></div>
                    <span className="font-label-caps text-label-caps text-momentum-green text-sm font-semibold tracking-wider leading-relaxed">Normal</span>
                  </div>
                </div>
                <h2 className="font-system-3-triage text-system-3-triage text-on-surface mb-2 group-hover:text-momentum-green transition-colors duration-200 text-xl font-bold leading-tight">{task.rawCapture}</h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-full border border-outline/10">Operations</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete(task._id);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-outline/30 hover:bg-surface-variant/20 hover:border-sea-foam/50 transition-colors ml-4"
                aria-label="Complete task"
              >
                <Check
                  className="w-4 h-4 text-transparent hover:text-sea-foam transition-colors"
                  strokeWidth={3}
                />
              </button>
            </div>
          ))}

          {activeTasks.length === 0 && (
            <div className="group relative bg-surface-container-low border border-outline/5 p-6 rounded-xl text-center">
              <h2 className="font-system-1-execution text-system-1-execution text-on-surface-variant text-xl font-bold leading-tight">No active tasks</h2>
              <p className="font-monospaced-logic text-monospaced-logic text-on-surface-variant/40 italic mt-2">Add a task above to get started</p>
            </div>
          )}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 md:hidden px-4 bg-surface-container-lowest rounded-t-xl shadow-2xl">
        <button className="flex flex-col items-center justify-center bg-tertiary-container text-on-tertiary-container rounded-full px-4 py-1 active:scale-[0.98] transition-transform duration-200">
          <span className="material-symbols-outlined" data-icon="target">target</span>
          <span className="font-label-caps text-label-caps mt-1">Tasks</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/10 active:scale-[0.98] transition-all duration-200 rounded-lg px-2 py-1">
          <span className="material-symbols-outlined" data-icon="inbox">inbox</span>
          <span className="font-label-caps text-label-caps mt-1">Inbox</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/10 active:scale-[0.98] transition-all duration-200 rounded-lg px-2 py-1">
          <span className="material-symbols-outlined" data-icon="timeline">timeline</span>
          <span className="font-label-caps text-label-caps mt-1">Forecast</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/10 active:scale-[0.98] transition-all duration-200 rounded-lg px-2 py-1">
          <span className="material-symbols-outlined" data-icon="history">history</span>
          <span className="font-label-caps text-label-caps mt-1">History</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-variant/10 active:scale-[0.98] transition-all duration-200 rounded-lg px-2 py-1">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
          <span className="font-label-caps text-label-caps mt-1">Settings</span>
        </button>
      </nav>
    </>
  );
}
