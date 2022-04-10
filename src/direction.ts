export type D4 = 'up' | 'down' | 'left' | 'right'
export type D2 = 'vertical' | 'horizontal'
export type DRot = 'clockwise' | 'counterclockwise'

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
  return dir === 'vertical' ? 'horizontal' : 'vertical'
}

export function showD4(dir:D4) : string {
  switch(dir) {
    case 'up': return 'u'
    case 'down': return 'd'
    case 'left': return 'l'
    case 'right': return 'r'
  }
}

export function readD4(str:string) : D4 {
  switch(str) {
    case 'u': return 'up'
    case 'd': return 'down'
    case 'l': return 'left'
    default: return 'right'
  }
}

export function showD2(dir:D2) : string {
  return dir === 'vertical' ? 'v' : 'h'
}

export function readD2(str:string) : D2 {
  return str === 'v' ? 'vertical' : 'horizontal'
}

export function showDRot(dir:DRot) : string {
  return dir === 'clockwise' ? 'r' : 'l'
}

export function readDRot(str:string) : DRot {
  return str === 'r' ? 'clockwise' : 'counterclockwise'
}

export function move(dir:D4, row:number, col:number) : [number, number] {
  switch(dir) {
    case 'up': return [row - 1, col]
    case 'down': return [row + 1, col]
    case 'left': return [row, col - 1]
    case 'right': return [row, col + 1]
  }
}

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
