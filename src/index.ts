import { createUnifiClient } from './unifi-client'
import { start as startHttp } from './http-server'
import { createEmitter } from './events';
import { createDBClient } from './db';
import { readFileSync } from 'fs';

const httpPort = parseInt(process.env.PORT || '')

const sslPassphrase = process.env.ROOT_PASSPHRASE
const sslKeyFile = process.env.ROOT_KEY
const sslCertFile = process.env.ROOT_PEM

const fbAppId = process.env.FB_APP_ID
const ggClientId = process.env.GG_CLIENT_ID

const unifiHost = process.env.UNIFI_HOST
const unifiPort = parseInt(process.env.UNIFI_PORT || '')
const unifiProtocol = process.env.UNIFI_PROTOCOL
const unifiUser = process.env.UNIFI_USER
const unifiPasswd = process.env.UNIFI_PASSWD

const dbHost = process.env.DB_HOST
const dbPort = parseInt(process.env.DB_PORT || '')
const dbName = process.env.DB_NAME

if (!(
  httpPort &&
  sslPassphrase &&
  fbAppId &&
  ggClientId &&
  sslKeyFile &&
  sslCertFile &&
  unifiHost &&
  unifiPort &&
  unifiProtocol &&
  unifiUser &&
  unifiPasswd &&
  dbHost &&
  dbPort &&
  dbName
)) {
  throw new Error(`bad ENV: 
    PORT:"${httpPort}"
    ROOT_PASSPHRASE:"${sslPassphrase}"
    FB_APP_ID:"${fbAppId}"
    GG_CLIENT_ID:"${ggClientId}"
    ROOT_KEY:"${sslKeyFile}"
    ROOT_PEM:"${sslCertFile}"
    UNIFI_HOST="${unifiHost}"
    UNIFI_PORT="${unifiPort}"
    UNIFI_PROTOCOL="${unifiProtocol}"
    UNIFI_USER="${unifiUser}"
    UNIFI_PASSWD="${unifiPasswd}"
    DB_HOST=${dbHost}
    DB_PORT=${dbPort}
    DB_NAME=${dbName}
  `);
}

const emitter = createEmitter(console.log)

createUnifiClient({
  host: unifiHost,
  port: unifiPort,
  protocol: unifiProtocol,
  user: unifiUser,
  passwd: unifiPasswd,
  emitter
})

createDBClient({ dbHost, dbName, dbPort, emitter })
const key = readFileSync(sslKeyFile)
const cert = readFileSync(sslCertFile)


startHttp({
  port: httpPort,
  SSL: { key, cert, passphrase: sslPassphrase },
  social: {
    FB: { fbAppId },
    GG: { ggClientId }
  },
  emitter
})
