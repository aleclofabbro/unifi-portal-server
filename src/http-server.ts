import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from 'https'
import { isLoginInfo, isAccessRequestParams, Emitter } from './events';
/**
 *
 *
 *  https://192.168.255.47.xip.io/guest/s/9qs5m663/
 *  ?ap=78:8a:20:20:ae:c0
 *  &id=9c:b6:d0:df:50:b5
 *  &t=1562599690
 *  &url=http://nmcheck.gnome.org/
 *  &ssid=PORTAL
 */

export interface Config {
  port: number
  SSL: {
    key: string | Buffer | Array<Buffer | Object>
    cert: string | Buffer | Array<string | Buffer>
    passphrase: string
  }
  social: {
    FB: { fbAppId: string }
    GG: { ggClientId: string }
  }
  emitter: Emitter
}
export const start = (config: Config) => {
  const { SSL, port, social } = config
  const app = express()
  app.set('view engine', 'ejs')
  app.use(bodyParser.json());
  // app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/static', express.static('static'))
  app.get('/guest/s/:siteId/', function (req, res) {
    const accessRequest = {
      ...req.params,
      ...req.query,
      fromIp: req.ip
    }
    // console.log(`accessParams:`, accessParams)
    if (isAccessRequestParams(accessRequest)) {
      config.emitter.emit('newAccessRequest', accessRequest)
      const params = {
        social,
        accessRequest,
      }
      res.render('captive', { params });
    } else {
      res.status(401).send({ ok: false })
    }
  });

  app.post('/_/login/', function (req, res) {
    // console.log(`login body:`, req.body)
    const { loginInfo, accessRequest } = req.body
    if (isLoginInfo(loginInfo) && isAccessRequestParams(accessRequest)) {
      // console.log(`...ok`)
      config.emitter.emit('newLogin', { loginInfo, accessRequest })
      res.status(200).send({ ok: true })
    } else {
      // console.log(`...bad`)
      res.status(401).send({ ok: false })
    }
  });

  createServer(SSL, app).listen(port, function () {
    console.log('Portal Server listening on port ' + port);
  });
}
