express = require('express')
app = express()

app.set('port', 8080)

app.listen(
  app.get('port'), () => console.log(`server listening on ${app.get('port')}`)
)


app.get(
  '/',
  (req, res) => res.send('Ajouter /hello/[Votre nom]  pour que la page vous salue')
)

app.get(
  '/hello/:name',
  (req, res) => {
    if (req.params.name == 'jean-baptiste'){

      res.send('jean-baptiste Crespo createur de cette page, age: 22 ans, mots favoris: Amphigouri ')

    } else {

      res.send("Hello " + req.params.name)

    }
  }
)



app.use(function(req, res){
       res.send('ERROR 404: page not found');
   });