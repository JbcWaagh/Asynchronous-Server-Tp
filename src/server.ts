import express = require('express')
import { MetricsHandler } from './metrics'
import bodyparser = require('body-parser')
import session = require('express-session')
import levelSession = require('level-session-store')
import morgan = require('morgan')



const app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
const port: string = process.env.PORT || '8080'
const Mhandler= new MetricsHandler('./db');
const LevelStore = levelSession(session)

app.use(morgan('dev'))

const authCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/auth/login')
}


app.listen('8080', (err: Error) => {
  if (err) throw err
  console.log('server is listening on port 8080')
})

app.use(session({
    secret: 'this is a very secret secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
  }))

app.get('/metrics/:id', (req: any, res: any) => {
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