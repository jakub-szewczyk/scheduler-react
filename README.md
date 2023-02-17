# Bugs

1. Notification title disappears on notification toggle.

2. "All schedules must be saved before creating a new one" message shows only if the unsaved schedule is open when it actually should show if there's at least one unsaved schedule, no matter if it's currently open or not.

3. Improper uniqueness validation should not be shown if no changes are being made. This can impact sibling fields by forcing a user to edit the unique field, even if they do not want to.
