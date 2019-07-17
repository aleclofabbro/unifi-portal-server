import { Emitter } from './events';
import { connect } from 'mongodb';

export interface Config {
  dbHost: string
  dbPort: number
  dbName: string
  emitter: Emitter
}
const LOGINS_COLLECTION = `logins`
export const createDBClient = async (config: Config) => {
  const client = await connect(`mongodb://${config.dbHost}:${config.dbPort}/${config.dbName}`, { useNewUrlParser: true })
  const db = client.db()
  const loginsColl = db.collection(LOGINS_COLLECTION)
  config.emitter.on('newLogin', _ => loginsColl.insert(_))
}