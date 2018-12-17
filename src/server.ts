import express = require('express')
import { MetricsHandler } from './metrics'
import session = require('express-session')
import levelSession = require('level-session-store')
import morgan = require('morgan')
import { UserHandler, User } from './user'



const app = express()
const port: string = process.env.PORT || '8080'
const Mhandler= new MetricsHandler('./db');
const LevelStore = levelSession(session)
const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()
const mRouter = express.Router()
const bodyParser = require('body-parser')
const path = require('path')


const metricsHandler= new MetricsHandler('./db/metrics');
const authCheck = (req: any, res: any, next: any) => {
    if (req.session.loggedIn) {
        next()
    } else res.redirect('/auth/login')
}

app.set('views', "./views")
app.set('view engine', 'ejs')

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})

app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded())



app.use('/auth', authRouter)


app.get('/', authCheck,(req: any, res: any) => {
    if(req.session.loggedIn){
        res.render('home', {name: req.session.user.username})}
    else {
        res.render('home', {name: 'unconnected'})
    }
})


//Deconnexion
app.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn
    delete req.session.user
    res.redirect('/auth/login')
})

///////////////////////////////////////
//auth router for login and signup ///
/////////////////////////////////////

//Login page
authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
})


//login to existing account
authRouter.post('/login', (req: any, res: any, next: any) => {
    if(req.body.username===""||req.body.password==="")
        res.status(401).send("Please enter your username and password")
    else{
        dbUser.get(req.body.username, (err: Error | null, result?: User) => {
            if (err) res.status(401).send("unable to login")
            else if (result === undefined || !result.validatePassword(req.body.password)) {
                res.status(401).send("login info incorrect")
            } else {
                req.session.loggedIn = true
                req.session.user = result
                // res.status(200).send
                res.redirect('/')
            }
        })}
})


//SignUp page
authRouter.get('/signup',(req:any,res:any,next:any)=>{
  res.render('signup')
})


///Création d'un compte
authRouter.post('/signup', (req: any, res: any, next: any) => {
    const { username, email,password  } = req.body
    if(username===""||email===""||password==""){
        res.status(401).send("Please enter all the info necessary to the new account")}
    else{
        const u = new User(username, email, password,false)
        dbUser.get(username,(err:Error|null,result?:User)=>{
            if(result!==undefined){
                res.status(400).send("username already exist")
            }
            else{
                dbUser.save(u, (err: Error | null) => {
                    if (err){
                        res.status(404).send("unable to create account")
                    }
                    else
                        res.status(200).send("New account created you may login now")
                })}
        })
    }})

///////////////////////////////////////////
//metrics router for  viewing the data ///
/////////////////////////////////////////

app.use('/metrics', mRouter)

//Check if auth is ok
mRouter.use(function (req: any, res: any, next: any) {
    authCheck(req,res,next)
})


// Get user own metrics
mRouter.get('/',(req:any,res:any,next:any)=>{

  metricsHandler.get(req.session.user.username,(err: Error|null,metrics:any)=>{
      console.log("access metrics")
      if(err)
          throw err
      else{
          res.render('metrics',{metrics:metrics,user:req.session.user.username})}
  })
})

// Create new metric for the user
mRouter.post ('/',(req:any,res:any,next:any)=>{
  if(req.body.timestamp===""||req.body.value==="")
      res.status(400).send("Fill the form to add a new metric")
  else{
      metricsHandler.save(req.session.user.username,[req.body],(err:Error|null)=>{
          if(err)
              res.status(401).send("error metric was not created" )
          else
              res.redirect('/metrics/')
      })}
})
