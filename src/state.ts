import assert from 'assert'

import { D4, D2, DRot, rotateD4, rotateD2, showD4, readD4, showD2, readD2, showDRot, readDRot } from './direction'

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
    case 'wall': return 'W'
    case 'box': return 'E'
    case 'board': return 'F' + showD2(s.dir)
    case 'destroyer': return 'D' + showD2(s.dir)
    case 'rotator': return 'R' + showDRot(s.dir)
    case 'pusher': return 'Q' + showD4(s.dir)
    case 'shifter': return 'S' + showD4(s.dir)
    case 'generator': return 'A' + showD4(s.dir)
  }
}

export function readState(str:string) : [State, string] {
  switch(str[0]) {
    case 'W': return [{ kind:'wall' }, str.substring(1)]
    case 'E': return [{ kind:'box'  }, str.substring(1)]
    case 'F': return [{ kind:'board',     dir:readD2(str[1])   }, str.substring(2)]
    case 'D': return [{ kind:'destroyer', dir:readD2(str[1])   }, str.substring(2)]
    case 'R': return [{ kind:'rotator',   dir:readDRot(str[1]) }, str.substring(2)]
    case 'Q': return [{ kind:'pusher',    dir:readD4(str[1])   }, str.substring(2)]
    case 'S': return [{ kind:'shifter',   dir:readD4(str[1])   }, str.substring(2)]
    case 'A': return [{ kind:'generator', dir:readD4(str[1])   }, str.substring(2)]
    default:  return [{ kind:'empty' }, str]
  }
}
