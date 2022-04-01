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
  A hybrid of the box and the wall. Boards with horizontal lines
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
Select a square by clicking or using the arrow keys. Then
press one of the following keys to create/edit a cell:

* W: wall
* X: box
* Z: board
* D: destroyer
* R: rotator
* Q: pusher
* S: shifter
* A: generator

Press the key multiple times to change the cell's direction. For
example, press Q three times to make a leftward-pointing pusher.

You can delete a cell by pressing E, and clear the entire grid
by pressing backspace.

Once you have created an initial pattern, press space
to run the automaton, and press space again to stop it. To change
the animation speed, use the digit keys from 1 to 5; 1 is the
slowest and 5 is the fastest.

### Inspiration
This project was inspired by a video game called [Cell Machine](https://samhogan.itch.io/cell-machine)
by Sam Hogan.
