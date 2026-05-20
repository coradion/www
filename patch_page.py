import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# 1. Add completeTask mutation
content = content.replace('const createTask = useMutation(api.functions.createTask);', 'const createTask = useMutation(api.functions.createTask);\n  const completeTask = useMutation((api.functions as unknown as { completeTask: import("convex/server").FunctionReference<"mutation"> }).completeTask);')

# 2. Add listTasks query
content = content.replace("""  // Mock user handling: sync a test user to get their user ID and org ID
  const syncUser = useMutation(api.functions.syncUser);
  const user = useQuery(api.functions.getUser, { tokenIdentifier: "mock-user-123" });""", """  // Mock user handling: sync a test user to get their user ID and org ID
  const syncUser = useMutation(api.functions.syncUser);
  const user = useQuery(api.functions.getUser, { tokenIdentifier: "mock-user-123" });

  // Query active tasks
  const tasks = useQuery(api.functions.listTasks, user ? { orgId: user.orgId } : "skip");
  const activeTasks = tasks?.filter((task: { status: string; _id: string; rawCapture: string }) => task.status === "active") ?? [];""")

# 3. Add handleComplete function
handle_complete_func = """
  const handleComplete = async (taskId: string) => {
    try {
      await completeTask({ taskId });
    } catch (error) {
      console.error("Failed to complete task", error);
    }
  };
"""
content = content.replace('const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {', handle_complete_func + '\n  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {')

# 4. Add the section to display active tasks
tasks_section = """
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
                    <svg className="w-4 h-4 text-transparent hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
"""

content = content.replace('</section>\n\n        <footer', '</section>\n' + tasks_section + '\n        <footer')

with open('src/app/page.tsx', 'w') as f:
    f.write(content)

print("Updated page.tsx")
