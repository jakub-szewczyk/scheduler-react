# Scheduler

Schedule your tasks with ease!

## Features

### Multiple project management

![](/public/screenshots/1.png)

### Take notes with the built in editor

![](/public/screenshots/2.png)

### Drag and drop your tasks on a kanban board

![](/public/screenshots/3.png)

### Schedule your tasks and meetings

![](/public/screenshots/4.png)

## Todo

- Increase test coverage.

- Server side persistance layer.

- Flickering save/rename text inside upsert dialogs.

## Known issues

### Kanban board - invalid menu position

Kanban scrollbar somehow collides with the MUI `<Menu />` component, resulting in an invalid menu position and unnecessary scroll restoration. Unknown steps to reproduce. The bug appears when opening the status or issue context menu.

### Kanban board - shaky drag animation

Steps to reproduce:

1. Make sure the kanban board is vertically scrollable.

2. Grab any issue item and drag it to the bottom.

3. Observe dragged element shaking.
