import clone from 'clone'
import p5 from 'p5'

import { Point, Grid } from './grid'

function sketch(p:p5) {
  const rows = 30
  const cols = 40
  let pt1:Point = { row:0, col:0 }
  let pt2:Point = { row:0, col:0 }

  let running = false //is animation running?
  let frame = 0       //number of frames since animation started
  let tickLength = 10 //frames per generation

  let backupGrid = new Grid(rows, cols)
  let grid = backupGrid

  function displayGrid() : void {
    grid.display(pt1, pt2, running, p)
  }

  function mousePoint() : Point {
    return {
      row : Math.floor(p.mouseY / p.height * rows),
      col : Math.floor(p.mouseX / p.width * cols)
    }
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
    else if(p.mouseIsPressed) {
      const mouse = mousePoint()
      if(pt2.row !== mouse.row || pt2.col !== mouse.col) {
        pt2 = mouse
        displayGrid()
      }
    }
  }

  p.mousePressed = function() : void {
    if(!running) {
      //change selected cell
      pt1 = mousePoint()
      pt2 = mousePoint()
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
      case 'arrowup': pt1.row--; pt2.row--; break
      case 'arrowdown': pt1.row++; pt2.row++; break
      case 'arrowleft': pt1.col--; pt2.col--; break
      case 'arrowright': pt1.col++; pt2.col++; break
      //edit grid
      case 'backspace': grid = new Grid(rows, cols); break
      case 'e': grid.editEmpty(pt1, pt2); break
      case 'w': grid.editWall(pt1, pt2); break
      case 'x': grid.editBox(pt1, pt2); break
      case 'z': grid.editBoard(pt1, pt2); break
      case 'd': grid.editDestroyer(pt1, pt2); break
      case 'r': grid.editRotator(pt1, pt2); break
      case 'q': grid.editPusher(pt1, pt2); break
      case 's': grid.editShifter(pt1, pt2); break
      case 'a': grid.editGenerator(pt1, pt2); break
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
