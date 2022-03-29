import clone from 'clone'
import p5 from 'p5'

import Grid from './grid'

function sketch(p:p5) {
  const rows = 30
  const cols = 40
  let slRow = 0 //selected row
  let slCol = 0 //selected column

  let running = false //is animation running?
  let frame = 0       //number of frames since animation started
  let tickLength = 10 //frames per generation

  let backupGrid = new Grid(rows, cols)
  let grid = backupGrid

  function displayGrid() : void {
    grid.display(slRow, slCol, running, p)
  }

  p.setup = function() : void {
    const canvas = p.createCanvas(800, 600)
    canvas.parent('game')
    canvas.style('border', '1px solid black')
    canvas.elt.onselectstart = () => false
    displayGrid()
  }

  p.draw = function() : void {
    if(running) {
      //update grid every 'tickLength' frames
      if(frame % tickLength === 0) {
        grid.step()
        displayGrid()
      }
      frame++
    }
  }

  p.mouseClicked = function() : void {
    if(!running) {
      //change selected cell
      slRow = Math.floor(p.mouseY / p.height * rows)
      slCol = Math.floor(p.mouseX / p.width * cols)
      displayGrid()
    }
  }

  function keyPressedRunning() : void {
    if(p.key === ' ') {
      //stop animation and restore initial grid
      running = false
      grid = backupGrid
      displayGrid()
    }
  }

  function keyPressedPaused() : void {
    //'break' will redraw grid, 'return' will not
    switch(p.key.toLowerCase()) {
      //move selected cell with arrow keys
      case 'arrowup': slRow--; break
      case 'arrowdown': slRow++; break
      case 'arrowleft': slCol--; break
      case 'arrowright': slCol++; break
      //edit grid
      case 'backspace': grid = new Grid(rows, cols); break
      case 'e': grid.editEmpty(slRow, slCol); break
      case 'w': grid.editWall(slRow, slCol); break
      case 'x': grid.editBox(slRow, slCol); break
      case 'z': grid.editBoard(slRow, slCol); break
      case 'd': grid.editDestroyer(slRow, slCol); break
      case 'r': grid.editRotator(slRow, slCol); break
      case 'q': grid.editPusher(slRow, slCol); break
      case 's': grid.editShifter(slRow, slCol); break
      case 'a': grid.editGenerator(slRow, slCol); break
      //start animation and create backup of grid
      case ' ':
        running = true
        frame = 0
        backupGrid = clone(grid)
        return
      default: return
    }
    displayGrid()
  }

  p.keyPressed = function() : boolean {
    if(running) keyPressedRunning()
    else keyPressedPaused()
    //change animation speed
    switch(p.key) {
      case '1': tickLength = 40; break
      case '2': tickLength = 20; break
      case '3': tickLength = 10; break
      case '4': tickLength = 5; break
      case '5': tickLength = 2; break
    }
    return false
  }
}

new p5(sketch)
