import p5 from 'p5'

import { D4, D2, DRot, Force, oppositeD4, move, moveWith } from './direction'
import { State, rotateState, showState, readState } from './state'
import Cell from './cell'

export type Point = { row:number, col:number }

export class Grid {
  readonly rows:number
  readonly cols:number
  readonly _g:Cell[][]

  constructor(rows:number, cols:number) {
    this.rows = rows
    this.cols = cols
    //initialise 'this._g' with empty cells
    this._g = Array.from({ length:rows }, () =>
      Array.from({ length:cols }, () => new Cell())
    )
  }

  outOfBounds(row:number, col:number) : boolean {
    return row < 0 || col < 0 || row >= this.rows || col >= this.cols
  }

  //apply a force to the given cell (unless out of bounds)
  addForce(row:number, col:number, f:Force) : void {
    if(this.outOfBounds(row, col)) return
    this._g[row][col].forces.add(f)
  }

  //add a potential state to the given cell (unless out of bounds)
  addState(row:number, col:number, s:State) : void {
    if(this.outOfBounds(row, col)) return
    this._g[row][col].newStates.push(s)
  }

  destroy(row:number, col:number, dir:D2) : void {
    if(dir === 'vertical') {
      this.addForce(row, col - 1, 'destroy')
      this.addForce(row, col + 1, 'destroy')
    }
    else {
      this.addForce(row - 1, col, 'destroy')
      this.addForce(row + 1, col, 'destroy')
    }
  }

  rotate(row:number, col:number, dir:DRot) : void {
    this.addForce(row - 1, col, dir)
    this.addForce(row + 1, col, dir)
    this.addForce(row, col - 1, dir)
    this.addForce(row, col + 1, dir)
  }

  push(row:number, col:number, dir:D4) : boolean {
    if(this.outOfBounds(row, col)) return false
    const state = this._g[row][col].state
    if(state.kind === 'empty') return true
    //walls and perpendicular boards/destroyers block movement
    if(state.kind === 'wall') return false
    const stop:D2 = (dir === 'up' || dir === 'down') ? 'horizontal' : 'vertical'
    if((state.kind === 'board' || state.kind === 'destroyer') && state.dir === stop) {
      return false
    }
    //only apply force if the next cell is pushable
    const [nextRow, nextCol] = move(dir, row, col)
    if(this.push(nextRow, nextCol, dir)) {
      this.addForce(row, col, dir)
      return true
    }
    return false
  }

  shift(row:number, col:number, dir:D4) : void {
    const [nextRow, nextCol] = move(dir, row, col)
    this.push(nextRow, nextCol, dir)
  }

  generate(row:number, col:number, dir:D4) : void {
    const [nextRow, nextCol] = move(dir, row, col)
    const [prevRow, prevCol] = move(oppositeD4(dir), row, col)
    if(this.outOfBounds(prevRow, prevCol)) return
    const prevState = this._g[prevRow][prevCol].state
    if(prevState.kind === 'empty') return
    //only create new stuff if cell in front of generator is pushable
    if(this.push(nextRow, nextCol, dir)) {
      this.addState(nextRow, nextCol, prevState)
    }
  }

  //call function with every row and column number
  loop(f : (row:number, col:number) => void) : void {
    for(let row = 0; row < this.rows; row++) {
      for(let col = 0; col < this.cols; col++) {
        f(row, col)
      }
    }
  }

  addForces() : void {
    this.loop((row:number, col:number) => {
      const state = this._g[row][col].state
      switch(state.kind) {
        case 'destroyer': this.destroy(row, col, state.dir); break
        case 'rotator': this.rotate(row, col, state.dir); break
        case 'pusher': this.push(row, col, state.dir); break
        case 'shifter': this.shift(row, col, state.dir); break
        case 'generator': this.generate(row, col, state.dir); break
      }
    })
  }

  //use forces on each cell to determine its new location/orientation
  addStates() : void {
    this.loop((row:number, col:number) => {
      const cell = this._g[row][col]
      cell.updateForces()
      const [nextRow, nextCol] = moveWith(cell.forces, row, col)
      if(cell.forces.has('clockwise'))
        this.addState(nextRow, nextCol, rotateState('clockwise', cell.state))
      else if(cell.forces.has('counterclockwise'))
        this.addState(nextRow, nextCol, rotateState('counterclockwise', cell.state))
      else if(!cell.forces.has('destroy'))
        this.addState(nextRow, nextCol, cell.state)
      cell.forces.clear()
    })
  }

  updateStates() : void {
    this.loop((row:number, col:number) => {
      this._g[row][col].updateState()
    })
  }

  //advance one full generation
  step() : void {
    this.addForces()
    this.addStates()
    this.updateStates()
  }

  display(pt1:Point, pt2:Point, running:boolean, p:p5) : void {
    const cellWidth = p.width / this.cols
    const cellHeight = p.height / this.rows

    const top = Math.min(pt1.row, pt2.row)
    const bottom = Math.max(pt1.row, pt2.row)
    const left = Math.min(pt1.col, pt2.col)
    const right = Math.max(pt1.col, pt2.col)

    this.loop((row:number, col:number) => {
      //don't highlight selected cell when animation is running
      const selected = !running && row >= top && row <= bottom && col >= left && col <= right
      this._g[row][col].display({
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight
      }, selected, p)
    })
  }

  copy(pt1:Point, pt2:Point) : void {
    const top = Math.min(pt1.row, pt2.row)
    const bottom = Math.max(pt1.row, pt2.row)
    const left = Math.min(pt1.col, pt2.col)
    const right = Math.max(pt1.col, pt2.col)

    let text = ''
    let empty = 0
    for(let r = top; r <= bottom; r++) {
      for(let c = left; c <= right; c++) {
        if(this.outOfBounds(r, c)) continue
        const state = this._g[r][c].state
        if(state.kind === 'empty') empty++
        else {
          if(empty > 0) {
            text += empty
            empty = 0
          }
          text += showState(state)
        }
      }
      empty = 0
      text += ';'
    }

    navigator.clipboard.writeText(text)
  }

  paste(pt1:Point, pt2:Point, text:string) : void {
    let row = Math.min(pt1.row, pt2.row)
    let col = Math.min(pt1.col, pt2.col)
    const left = col
    while(text.length > 0) {
      if(text[0] === ';') {
        text = text.substring(1)
        row++
        col = left
        continue
      }
      const num = parseInt(text, 10)
      if(isNaN(num)) {
        const [state, newText] = readState(text)
        text = newText
        this.setState(row, col, state)
        col++
      }
      else {
        const digits = Math.floor(Math.log10(num) + 1)
        text = text.substring(digits)
        col += num
      }
    }
  }

  setState(row:number, col:number, s:State) {
    if(this.outOfBounds(row, col)) return
    this._g[row][col].state = s
  }

  //apply a function to the given cell's state
  editRegion(pt1:Point, pt2:Point, f : (s:State) => State) : void {
    const top = Math.min(pt1.row, pt2.row)
    const bottom = Math.max(pt1.row, pt2.row)
    const left = Math.min(pt1.col, pt2.col)
    const right = Math.max(pt1.col, pt2.col)

    for(let r = top; r <= bottom; r++) {
      for(let c = left; c <= right; c++) {
        if(this.outOfBounds(r, c)) continue
        const cell = this._g[r][c]
        cell.state = f(cell.state)
      }
    }
  }

  editEmpty(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) => ({ kind:'empty' }))
  }

  editWall(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) => ({ kind:'wall' }))
  }

  editBox(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) => ({ kind:'box' }))
  }

  editBoard(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) =>
      s.kind === 'board' ? rotateState('clockwise', s)
      : { kind:'board', dir:'vertical' }
    )
  }

  editDestroyer(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) =>
      s.kind === 'destroyer' ? rotateState('clockwise', s)
      : { kind:'destroyer', dir:'vertical' }
    )
  }

  editRotator(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) =>
      s.kind === 'rotator' && s.dir === 'clockwise'
      ? { kind:'rotator', dir:'counterclockwise' }
      : { kind:'rotator', dir:'clockwise' }
    )
  }

  editPusher(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) =>
      s.kind === 'pusher' ? rotateState('clockwise', s)
      : { kind:'pusher', dir:'right' }
    )
  }

  editShifter(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) =>
      s.kind === 'shifter' ? rotateState('clockwise', s)
      : { kind:'shifter', dir:'right' }
    )
  }

  editGenerator(pt1:Point, pt2:Point) : void {
    this.editRegion(pt1, pt2, (s:State) =>
      s.kind === 'generator' ? rotateState('clockwise', s)
      : { kind:'generator', dir:'right' }
    )
  }
}
