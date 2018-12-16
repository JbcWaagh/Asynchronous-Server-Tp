import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser = require('body-parser')

const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
const port: string = process.env.PORT || '8080'
const Mhandler= new MetricsHandler('./db');
app.get('/', (req: any, res: any) => {
    res.write('running ok')
    res.end()
  })
app.listen(port, (err: Error) => {
    if (err) {
      throw err
    }
    console.log(`server is listening on port ${port}`)
  })

app.get('/metrics:id', (req: any, res: any) => {
  Mhandler.get(req.params.id,(err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.json(result)
  })
})

app.post('/metrics/:id', (req: any, res: any) => {
    Mhandler.save(req.params.id,req.body,(err: Error | null) => {
      if (err) {
        throw err
      }
      res.status(200).send()
    })
  })