# Scheduler

TODO: Description

## TODO

- Increase test coverage to gain high confidence (component, e2e).

- Flickering save/rename text inside upsert dialogs (every module).

- Server side persistance layer (authentication, local-remote data synchronization).

## Known issues

### Kanban board - invalid menu position

Kanban scrollbar somehow collides with the MUI `<Menu />` component, resulting in an invalid menu position and unnecessary scroll restoration. Unknown steps to reproduce. The bug appears when opening the status or issue context menu.

### Kanban board - shaky drag animation

Steps to reproduce:

1. Make sure the kanban board is vertically scrollable.

2. Grab any issue item and drag it to the bottom.

3. Observe dragged element shaking.
