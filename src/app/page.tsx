export default function Home() {
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
                placeholder="What's on your mind? (TEA Framework)"
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-zinc-500"
              />
              <button className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-black px-6 py-2 rounded-xl font-medium">
                Capture
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
