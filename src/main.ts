/* (c) 2022 Owen Bechtel
 * Licence: MIT (see LICENSE file)
 */

import clone from 'clone'
import p5 from 'p5'

import { Region, Grid } from './grid'

function sketch(p:p5) {
  const rows = 30
  const cols = 40
  let aRow = 0
  let aCol = 0
  let bRow = 0
  let bCol = 0

  let running = false
  let frame = 0
  let tickLength = 10

  let backupGrid = new Grid(rows, cols)
  let grid = backupGrid

  function displayGrid() : void {
    grid.display(region(), running, p)
  }

  function mouseRow() : number {
    return Math.floor(p.mouseY / p.height * rows)
  }

  function mouseCol() : number {
    return Math.floor(p.mouseX / p.width * cols)
  }

  function region() : Region {
    return {
      top : p.min(aRow, bRow),
      bottom : p.max(aRow, bRow),
      left : p.min(aCol, bCol),
      right : p.max(aCol, bCol)
    }
  }

  p.setup = function() : void {
    const canvas = p.createCanvas(800, 600)
    canvas.parent('game')
    canvas.style('border', '1px solid black')
    canvas.elt.onselectstart = () => false
    displayGrid()

    document.oncopy = () => {
      grid.copy(region())
    }

    document.oncut = () => {
      grid.copy(region())
      grid.editEmpty(region())
      displayGrid()
    }

    document.onpaste = (event:ClipboardEvent) => {
      if(event.clipboardData) {
        grid.paste(region(), event.clipboardData.getData('text'))
        displayGrid()
      }
    }
  }

  p.draw = function() : void {
    if(running) {
      if(frame % tickLength === 0) {
        grid.step()
        displayGrid()
      }
      frame++
    }
    else if(p.mouseIsPressed) {
      const row = mouseRow()
      const col = mouseCol()
      if(bRow !== row || bCol !== col) {
        bRow = row
        bCol = col
        displayGrid()
      }
    }
  }

  p.mousePressed = function() : void {
    if(!running) {
      aRow = mouseRow()
      bRow = mouseRow()
      aCol = mouseCol()
      bCol = mouseCol()
      displayGrid()
    }
  }

  function keyPressedRunning() : void {
    if(p.key === ' ') {
      running = false
      grid = backupGrid
      displayGrid()
    }
  }

  function keyPressedPaused() : void {
    //'break' will redraw grid, 'return' will not
    switch(p.key.toLowerCase()) {
      case 'arrowup': aRow--; bRow--; break
      case 'arrowdown': aRow++; bRow++; break
      case 'arrowleft': aCol--; bCol--; break
      case 'arrowright': aCol++; bCol++; break

      case 'backspace': case 'tab': grid.editEmpty(region()); break
      case 'w': grid.editWall(region()); break
      case 'e': grid.editBox(region()); break
      case 'f': grid.editBoard(region()); break
      case 'd': grid.editDestroyer(region()); break
      case 'r': grid.editRotator(region()); break
      case 'q': grid.editPusher(region()); break
      case 's': grid.editShifter(region()); break
      case 'a': grid.editGenerator(region()); break

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
    switch(p.key) {
      case '1': tickLength = 40; break
      case '2': tickLength = 20; break
      case '3': tickLength = 10; break
      case '4': tickLength = 5; break
      case '5': tickLength = 2; break
    }
    return false //prevent scrolling with arrow keys
  }
}

new p5(sketch)
