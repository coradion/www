const ctx: Worker = self as any;

ctx.addEventListener("message", (event) => {
  console.log(event);
});

export {};
