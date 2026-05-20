import re

with open('convex/functions.ts', 'r') as f:
    content = f.read()

content = content.replace('let user = await ctx.db', 'const user = await ctx.db')

with open('convex/functions.ts', 'w') as f:
    f.write(content)
