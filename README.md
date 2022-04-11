# Forces at Play
A cellular automaton.

* [Try it online](https://owenbechtel.com/games/forces-at-play)

### Cell types
There are nine kinds of cell:

* Empty (white square)
* Pusher (blue square with arrow)\
  Moves in the direction of the arrow, pushing the cells in
  front of it, unless blocked by a wall or a board.
* Box (black square with white square inside it)\
  Doesn't do anything on its own, but can be moved by other
  cells.
* Wall (solid black square)\
  Cannot be moved by other cells.
* Board (black square with parallel lines)\
  Boards with horizontal lines
  can move horizontally but not vertically; boards with vertical
  lines can move vertically but not horizontally.
* Destroyer (red square with parallel lines)\
  Adjacent cells in the direction of the lines are safe; adjacent
  cells perpendicular to the lines are deleted.
* Shifter (purple square with arrow)\
  Similar to the pusher, but doesn't move itself, only the 
  cells in front of it.
* Rotator (green square with arc)\
  Rotates the adjacent cells. There are two types of rotator:
  the one with a "C" rotates things counterclockwise, and the
  one with a "Ɔ" rotates things clockwise.
* Generator (yellow square with arrow)\
  Creates copies of the cell behind it.

### Controls
* Click: select cell
* Click and drag: select region
* Arrow keys: move selected region
* W: create wall
* E: create box
* F: create/edit board
* D: create/edit destroyer
* R: create/edit rotator
* Q: create/edit pusher
* S: create/edit shifter
* A: create/edit generator
* Backspace: delete region
* Space: start/stop automaton
* Digits 1-5: change animation speed (1 is slowest, 5 is fastest)

### Inspiration
This project was inspired by a video game called [Cell Machine](https://samhogan.itch.io/cell-machine)
by Sam Hogan.
