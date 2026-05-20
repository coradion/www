import re

with open('src/app/page.tsx', 'r') as f:
    content = f.read()

# Replace handleCapture
old_handleCapture = """  const handleCapture = async () => {
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
  };"""

new_handleCapture = """  const handleCapture = async () => {
    // If not using real auth yet, allow submission even if user isn't loaded completely
    // Let convex test setup handle the rest if mock user isn't ready
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
  };"""

if old_handleCapture in content:
    content = content.replace(old_handleCapture, new_handleCapture)
    with open('src/app/page.tsx', 'w') as f:
        f.write(content)
    print("Updated page.tsx")
else:
    print("Could not find old handleCapture")
