import StrictEventEmitter from 'strict-event-emitter-types'
import { EventEmitter } from 'events';
export interface AccessRequest {
  siteId: string
  ap: string
  id: string
  t: string
  url: string
  ssid: string,
  fromIp: string
}

export interface GGInfo extends AbsLoginInfo<'GG', {
  email: string
}> { }

export interface FBInfo extends AbsLoginInfo<'FB', {
  email: string
}> { }

export interface AbsLoginInfo<
  By extends 'GG' | 'FB',
  Info extends { email: string }> {
  by: By,
  info: Info
}

export type LoginInfo = GGInfo | FBInfo

interface Events {
  newAccessRequest: AccessRequest
  newLogin: { loginInfo: LoginInfo, accessRequest: AccessRequest }
}
export type Emitter = StrictEventEmitter<EventEmitter, Events>

export const createEmitter = (on_all?: Function): Emitter => {
  const emitter = new EventEmitter as Emitter
  const _emit = emitter.emit.bind(emitter)

  // @ts-ignore
  emitter.emit = (...args) => {
    // @ts-ignore
    _emit(...args)
    on_all && on_all(...args)
  }
  return emitter
}

export function isLoginInfo(_: any): _ is LoginInfo {
  return true
}
export function isAccessRequestParams(_: any): _ is AccessRequest {
  return true
}

