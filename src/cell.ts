/* (c) 2022 Owen Bechtel
 * Licence: MIT (see LICENSE file)
 */

import p5 from 'p5'

import { D4, D2, DRot, Force } from './direction'
import { Kind, State, chooseState } from './state'

function rectColor(k:Kind, selected:boolean) : string {
  if(selected) {
    switch(k) {
      case 'empty': return '#DDDDDD' //white
      case 'wall': case 'box': case 'board': return '#666666' //black
      case 'destroyer': return '#E66283' //red
      case 'rotator': return '#A7CCAD' //green
      case 'pusher': return '#52BDFB' //blue
      case 'shifter': return '#A97BE0' //purple
      case 'generator': return '#FFCE5A' //yellow
    }
  }
  else {
    switch(k) {
      case 'empty': return '#FFFFFF' //white
      case 'wall': case 'box': case 'board': return '#000000' //black
      case 'destroyer': return '#AF1B3F' //red
      case 'rotator': return '#6BAA75' //green
      case 'pusher': return '#0582CA' //blue
      case 'shifter': return '#6F2DBD' //purple
      case 'generator': return '#ECA400' //yellow
    }
  }
}

type Rect = { x:number, y:number, width:number, height:number }

//draw a white square inside the rectangle
function drawBox(r:Rect, p:p5) : void {
  p.stroke(255)
  p.strokeWeight(0.1)
  p.noFill()
  p.applyMatrix(r.width, 0, 0, r.height, r.x, r.y)
  p.rect(1/3, 1/3, 1/3, 1/3)
  p.resetMatrix()
}

//draw two parallel lines inside the rectangle (either vertical or horizontal)
//used for 'board' and 'destroyer' states
function drawBoard(r:Rect, dir:D2, p:p5) : void {
  p.stroke(255)
  p.strokeWeight(0.1)
  p.applyMatrix(r.width, 0, 0, r.height, r.x, r.y)
  if(dir === 'vertical') {
    p.line(1/3, 1/4, 1/3, 3/4)
    p.line(2/3, 1/4, 2/3, 3/4)
  }
  else {
    p.line(1/4, 1/3, 3/4, 1/3)
    p.line(1/4, 2/3, 3/4, 2/3)
  }
  p.resetMatrix()
}

//draw a "C" shape inside the rectangle
//(mirrored or regular, representing clockwise and counterclockwise resp.)
function drawRotator(r:Rect, dir:DRot, p:p5) : void {
  p.stroke(255)
  p.strokeWeight(0.1)
  p.applyMatrix(r.width, 0, 0, r.height, r.x, r.y)
  if(dir === 'clockwise') {
    p.arc(1/2, 1/2, 1/2, 1/2, 5*p.TAU/8, 3*p.TAU/8)
  }
  else {
    p.arc(1/2, 1/2, 1/2, 1/2, p.TAU/8, 7*p.TAU/8)
  }
  p.resetMatrix()
}

//draw an arrow pointing in one of the four cardinal directions
//used for 'pusher', 'shifter', and 'generator' states
function drawArrow(r:Rect, dir:D4, p:p5) : void {
  p.noStroke()
  p.fill(255)
  p.applyMatrix(r.width, 0, 0, r.height, r.x, r.y)
  switch(dir) {
    case 'up': p.triangle(1/4, 2/3, 3/4, 2/3, 1/2, 1/4); break
    case 'down': p.triangle(1/4, 1/3, 3/4, 1/3, 1/2, 3/4); break
    case 'left': p.triangle(2/3, 1/4, 2/3, 3/4, 1/4, 1/2); break
    case 'right': p.triangle(1/3, 1/4, 1/3, 3/4, 3/4, 1/2); break
  }
  p.resetMatrix()
}

export default class Cell {
  state:State
  forces:Set<Force>
  newStates:State[] //potential states in the next generation

  constructor() {
    this.state = { kind:'empty' }
    this.forces = new Set()
    this.newStates = []
  }

  //cancel out two forces (e.g. 'up' and 'down') if both are present
  cancelOut(f1:Force, f2:Force) : void {
    if(this.forces.has(f1) && this.forces.has(f2)) {
      this.forces.delete(f1)
      this.forces.delete(f2)
    }
  }

  updateForces() : void {
    if(this.forces.size === 0) return
    if(this.forces.has('destroy')) {
      this.forces.clear()
      this.forces.add('destroy')
      return
    }
    this.cancelOut('up', 'down')
    this.cancelOut('left', 'right')
    this.cancelOut('clockwise', 'counterclockwise')
  }

  //choose one of the potential states to be the cell's next state
  updateState() : void {
    if(this.newStates.length === 0) {
      this.state = { kind:'empty' }
      return
    }
    if(this.newStates.length === 1) {
      this.state = this.newStates[0]
      this.newStates = []
      return
    }
    this.state = this.newStates.reduce(chooseState)
    this.newStates = []
  }

  display(r:Rect, selected:boolean, p:p5) : void {
    p.noStroke()
    p.fill(rectColor(this.state.kind, selected))
    p.rect(r.x, r.y, r.width, r.height)
    switch(this.state.kind) {
      case 'empty': case 'wall': return
      case 'box': drawBox(r, p); return
      case 'board': case 'destroyer':
        drawBoard(r, this.state.dir, p); return
      case 'rotator':
        drawRotator(r, this.state.dir, p); return
      case 'pusher': case 'shifter': case 'generator':
        drawArrow(r, this.state.dir, p); return
    }
  }
}
