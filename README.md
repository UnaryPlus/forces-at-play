# Forces at Play
A cellular automaton based on Sam Hogan's [Cell Machine](https://samhogan.itch.io/cell-machine).

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
  the one with a "C" rotates counterclockwise, and the
  one with a "Ɔ" rotates clockwise.
* Generator (yellow square with arrow)\
  Creates copies of the cell behind it.
  
### Compilation
To compile for the browser, run the following commands:

```
npm install
npx tsc
npx browserify js/main.js -o game.js
```
