import Axios from 'axios'

const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;

import { Agent } from 'https';
import { Emitter, AccessRequest } from './events';


export interface Config {
  host: string
  protocol: string
  port: number
  user: string
  passwd: string
  emitter: Emitter
}
export const createUnifiClient = (config: Config) => {
  const axios = Axios.create({
    withCredentials: true,
    baseURL: `${config.protocol}://${config.host}:${config.port}/api`,
    httpsAgent: new Agent({ rejectUnauthorized: false })
  });
  axiosCookieJarSupport(axios);

  const jar = new tough.CookieJar();
  // @ts-ignore
  axios.defaults.jar = jar


  const authorizeGuest = (accessRequest: AccessRequest) => login().then(_ => axios({
    url: `/s/${accessRequest.siteId}/cmd/stamgr`,
    method: 'POST',
    data: {
      mac: accessRequest.id,
      cmd: "authorize-guest"
    }
  }).then(_ => {
    _
    // console.log('authorizeGuest OK:', _.data)
  }, _ => {
    _
    // console.error('authorizeGuest KO:', _.response.data)
  })
  )

  const login = () => axios({
    method: 'POST',
    url: `/login`,
    data: {
      username: config.user,
      password: config.passwd,
      // remember: true,
      // strict: true
    }
  })
    .then(_ => {
      _
      // console.log('login OK:', _.data)
    }, _ => {
      _
      // console.error('login KO:', _.response.data)
    })

  config.emitter.on('newLogin', _ => {
    authorizeGuest(_.accessRequest)
  })

  return {
    login,
    authorizeGuest
  }
}
