import deepEqual from 'deep-equal'

import { D4, D2, DRot, chooseD4, rotateD4, rotateD2 } from './direction'

export type Kind = 'empty' | 'wall' | 'box' | 'board' | 'destroyer'
  | 'rotator' | 'pusher' | 'shifter' | 'generator'

//type of all possible cell states
export type State
  = { kind:'empty' }
  | { kind:'wall' }
  | { kind:'box' }
  | { kind:'board', dir:D2 }
  | { kind:'destroyer', dir:D2 }
  | { kind:'rotator', dir:DRot }
  | { kind:'pusher', dir:D4 }
  | { kind:'shifter', dir:D4 }
  | { kind:'generator', dir:D4 }

export function rotateState(rot:DRot, s:State) : State {
  switch(s.kind) {
    case 'empty': case 'wall': case 'box': case 'rotator': return s
    case 'board': case 'destroyer':
      return { kind:s.kind, dir:rotateD2(s.dir) }
    case 'pusher': case 'shifter': case 'generator':
      return { kind:s.kind, dir:rotateD4(rot, s.dir) }
  }
}

//order that determines which state "wins" in case of overlap
function orderKind(k:Kind) : number {
  switch(k) {
    case 'empty': return 0
    case 'wall': return 1
    case 'box': return 2
    case 'board': return 3
    case 'destroyer': return 4
    case 'rotator': return 5
    case 'pusher': return 6
    case 'shifter': return 7
    case 'generator': return 8
  }
}

//choose between states in case of overlap
export function chooseState(s1:State, s2:State) : State {
  //if states are equal, it doesn't matter
  if(deepEqual(s1, s2)) return s1
  if(s1.kind === s2.kind) {
    switch(s1.kind) {
      //vertical beats horizontal
      case 'board': case 'destroyer': return { kind:s1.kind, dir:'vertical' }
      //clockwise beats counterclockwise
      case 'rotator': return { kind:'rotator', dir:'clockwise' }
      case 'pusher': case 'shifter': case 'generator':
        if(s1.kind === s2.kind) return { kind:s1.kind, dir:chooseD4(s1.dir, s2.dir) }
    }
  }
  const order1 = orderKind(s1.kind)
  const order2 = orderKind(s2.kind)
  return order1 > order2 ? s1 : s2
}
