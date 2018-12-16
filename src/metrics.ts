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
  private db: any

  constructor(dbPath: string) {
    this.db = LevelDb.open(dbPath)

  }

  public get(key: string, callback: (error: Error | null, result?: Metric[]) => void) {
    const rs = this.db.createReadStream(key)
    var met: Metric[] = [];
    rs.on("error", callback)
    rs.on("end", (err: Error) => {callback(null, met);})
    rs.on("data", (data:any) => {
        console.log(data)
    })
  }

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const ws = WriteStream(this.db)
    ws.on('error', callback)
    ws.on('close', callback)
    metrics.forEach((m: Metric) => {
      ws.write({ key: `metric:${key}${m.timestamp}`, value: m.value })
    })
    ws.end()
  }

  public delete(key: string,callback: (error: Error | null) => void){
    const rs= this.db.createReadStream();
     rs.on("error", callback)
     rs.on("end", (err: Error) => { callback(null);})
     rs.on("data", (data: any) => {
        this.db.del(data.key);
    });
  }


}

