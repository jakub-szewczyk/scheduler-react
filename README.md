# Scheduler

TODO: Description

## TODO

- Add a favicon.

- Add 404 page.

- Highlight currently working widget (schedule, board, note) in their respective selection drawers.

- Improve notes module: add support for multiple notes management and general CRUD operations.

- Display selected kanban board name.

- Consider moving schedule name to the top.

- Customize textarea scrollbar.

- Improve notification configuration dialog styles - prevent textfield helper text from wrapping.

- Locate the notification listener at the app level, so that they can trigger when browsing on any screen.

- Increase test coverage to gain high confidence (component, e2e).

## Known issues

### Kanban board - invalid menu position

Kanban scrollbar somehow collides with the MUI `<Menu />` component, resulting in an invalid menu position and unnecessary scroll restoration. Unknown steps to reproduce. The bug appears when opening the status or issue context menu.

### Kanban board - shaky drag animation

Steps to reproduce:

1. Make sure the kanban board is vertically scrollable.

2. Grab any issue item and drag it to the bottom.

3. Observe dragged element shaking.
