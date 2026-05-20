import re

with open('convex/functions.ts', 'r') as f:
    content = f.read()

# Update status: "inbox" to status: "active"
new_content = re.sub(r'status:\s*"inbox"', 'status: "active", // Updated to default to active for self-captured tasks as per spec', content)

with open('convex/functions.ts', 'w') as f:
    f.write(new_content)

print("Updated functions.ts")
