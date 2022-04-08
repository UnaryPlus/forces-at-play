export type D4 = 'up' | 'down' | 'left' | 'right'
export type D2 = 'vertical' | 'horizontal'
export type DRot = 'clockwise' | 'counterclockwise'

//cells can be moved, rotated, or destroyed
export type Force = D4 | DRot | 'destroy'

export function oppositeD4(dir:D4) : D4 {
  switch(dir) {
    case 'up': return 'down'
    case 'down': return 'up'
    case 'left': return 'right'
    case 'right': return 'left'
  }
}

export function rotateD4(rot:DRot, dir:D4) : D4 {
  if(rot === 'clockwise') {
    switch(dir) {
      case 'up': return 'right'
      case 'down': return 'left'
      case 'left': return 'up'
      case 'right': return 'down'
    }
  }
  else {
    switch(dir) {
      case 'up': return 'left'
      case 'down': return 'right'
      case 'left': return 'down'
      case 'right': return 'up'
    }
  }
}

export function rotateD2(dir:D2) : D2 {
  return dir === 'horizontal' ? 'vertical' : 'horizontal'
}

//move coordinates in the given direction
export function move(dir:D4, row:number, col:number) : [number, number] {
  switch(dir) {
    case 'up': return [row - 1, col]
    case 'down': return [row + 1, col]
    case 'left': return [row, col - 1]
    case 'right': return [row, col + 1]
  }
}

//move coordinates by applying a set of forces
export function moveWith(forces:Set<Force>, row:number, col:number) : [number, number] {
  const nextRow =
    forces.has('up') ? row - 1
  : forces.has('down') ? row + 1
  : row
  const nextCol =
    forces.has('left') ? col - 1
  : forces.has('right') ? col + 1
  : col
  return [nextRow, nextCol]
}
