# Scheduler

TODO: Description

## TODO

- Increase test coverage to gain high confidence (component, e2e).

- Multiple projects management.

- Server side persistance layer (authentication, local-remote data synchronization).

- Locate the notification listener at the app level, so that they can trigger when browsing on any screen.

- (Optional) Notification configuration dialog - prevent textfield helper text from wrapping.

## Known issues

### Kanban board - invalid menu position

Kanban scrollbar somehow collides with the MUI `<Menu />` component, resulting in an invalid menu position and unnecessary scroll restoration. Unknown steps to reproduce. The bug appears when opening the status or issue context menu.

### Kanban board - shaky drag animation

Steps to reproduce:

1. Make sure the kanban board is vertically scrollable.

2. Grab any issue item and drag it to the bottom.

3. Observe dragged element shaking.
