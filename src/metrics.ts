import { LevelDb } from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  public db: any
  private dbPath: string

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)
    this.dbPath = dbPath

  }

  public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const ws = WriteStream(this.db)
    ws.on('error', callback)
    ws.on('close', callback)
    metrics.forEach((m: Metric) => {
      ws.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })
    ws.end()
  }


  public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {
    const rs = this.db.createReadStream(key)
    var met: Metric[] = [];
    rs.on("error", callback)
    rs.on("end", (err: Error) => { callback(null, met); })
    rs.on("data", (data: any) => {
      const [, key2, timestamp] = data.key.split(":")
      if (key === key2) {
        met.push(new Metric(timestamp, data.value))
      }
    })
  }


  public delete(key: string, timestamp: string, callback: (error: Error | null) => void) {
    const rs = this.db.createReadStream();
    rs.on("error", callback)
    rs.on("end", (err: Error) => { callback(null); })
    rs.on("data", (data: any) => {
      const [, keyC, timestampC] = data.key.split(":")

      if (keyC == key && timestampC == timestamp) {
        this.db.del(data.key)
      }
    })
  }
}

