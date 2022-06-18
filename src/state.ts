/* (c) 2022 Owen Bechtel
 * Licence: MIT (see LICENSE file)
 */
 
import assert from 'assert'

import { D4, D2, DRot, rotateD4, rotateD2 } from './direction'

export type Kind = 'empty' | 'wall' | 'box' | 'board' | 'destroyer'
  | 'rotator' | 'pusher' | 'shifter' | 'generator'

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
  if(s1.kind !== s2.kind) {
    const order1 = orderKind(s1.kind)
    const order2 = orderKind(s2.kind)
    return order1 > order2 ? s1 : s2
  }
  return Math.random() < 0.5 ? s1 : s2;
}

export function showState(s:State) : string {
  switch(s.kind) {
    case 'empty': return ''
    case 'wall': return 'w'
    case 'box': return 'e'
    case 'board': return s.dir === 'vertical' ? 'f' : 'F'
    case 'destroyer': return s.dir === 'vertical' ? 'd' : 'D'
    case 'rotator': return s.dir === 'clockwise' ? 'r' : 'R'

    case 'pusher':
      switch(s.dir) {
        case 'up': return 'q'
        case 'down': return 'Q'
        case 'left': return 'p'
        case 'right': return 'P'
      }
    case 'shifter':
      switch(s.dir) {
        case 'up': return 's'
        case 'down': return 'S'
        case 'left': return 'z'
        case 'right': return 'Z'
      }
    case 'generator':
      switch(s.dir) {
        case 'up': return 'a'
        case 'down': return 'A'
        case 'left': return 'g'
        case 'right': return 'G'
      }
  }
}

export function readState(str:String) : State | null {
  switch(str) {
    case 'w': return { kind:'wall' }
    case 'e': return { kind:'box' }
    case 'f': return { kind:'board', dir:'vertical' }
    case 'F': return { kind:'board', dir:'horizontal' }
    case 'd': return { kind:'destroyer', dir:'vertical' }
    case 'D': return { kind:'destroyer', dir:'horizontal' }
    case 'r': return { kind:'rotator', dir:'clockwise' }
    case 'R': return { kind:'rotator', dir:'counterclockwise' }
    case 'q': return { kind:'pusher', dir:'up' }
    case 'Q': return { kind:'pusher', dir:'down' }
    case 'p': return { kind:'pusher', dir:'left' }
    case 'P': return { kind:'pusher', dir:'right' }
    case 's': return { kind:'shifter', dir:'up' }
    case 'S': return { kind:'shifter', dir:'down' }
    case 'z': return { kind:'shifter', dir:'left' }
    case 'Z': return { kind:'shifter', dir:'right' }
    case 'a': return { kind:'generator', dir:'up' }
    case 'A': return { kind:'generator', dir:'down' }
    case 'g': return { kind:'generator', dir:'left' }
    case 'G': return { kind:'generator', dir:'right' }
    default: return null
  }
}
