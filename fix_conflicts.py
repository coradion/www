import re

with open("convex/functions.test.ts", "r") as f:
    content = f.read()

content = re.sub(r'<<<<<<< HEAD\n\n=======\n>>>>>>> origin/main', '', content)
content = re.sub(r'<<<<<<< HEAD\n\n    const tWithIdentity1 = t.withIdentity\({\n      tokenIdentifier: "user_multi_org",\n    }\);\n    // @ts-expect-error - vitest environment\n    const user1 = await tWithIdentity1.query\(getUser, {\n      tokenIdentifier: "user_multi_org",\n    }\);\n=======\n    const tWithIdentity1 = t.withIdentity\({ tokenIdentifier: "user_multi_org" }\);\n    // @ts-expect-error - vitest environment\n    const user1 = await tWithIdentity1.query\(getUser, { tokenIdentifier: "user_multi_org" }\);\n>>>>>>> origin/main', '    const tWithIdentity1 = t.withIdentity({\n      tokenIdentifier: "user_multi_org",\n    });\n    // @ts-expect-error - vitest environment\n    const user1 = await tWithIdentity1.query(getUser, {\n      tokenIdentifier: "user_multi_org",\n    });', content)
content = re.sub(r'<<<<<<< HEAD\n\n    const tWithIdentity2 = t.withIdentity\({\n      tokenIdentifier: "user_multi_org",\n    }\);\n    // @ts-expect-error - vitest environment\n    const user2 = await tWithIdentity2.query\(getUser, {\n      tokenIdentifier: "user_multi_org",\n    }\);\n=======\n    const tWithIdentity2 = t.withIdentity\({ tokenIdentifier: "user_multi_org" }\);\n    // @ts-expect-error - vitest environment\n    const user2 = await tWithIdentity2.query\(getUser, { tokenIdentifier: "user_multi_org" }\);\n>>>>>>> origin/main', '    const tWithIdentity2 = t.withIdentity({\n      tokenIdentifier: "user_multi_org",\n    });\n    // @ts-expect-error - vitest environment\n    const user2 = await tWithIdentity2.query(getUser, {\n      tokenIdentifier: "user_multi_org",\n    });', content)


with open("convex/functions.test.ts", "w") as f:
    f.write(content)
