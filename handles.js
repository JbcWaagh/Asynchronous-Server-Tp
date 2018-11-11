const url = require('url')
const qs = require('querystring')
const http = require('http')


module.exports = {

	serverHandle: function (req, res) {
		const route = url.parse(req.url)
		const path = route.pathname 
		const params = qs.parse(route.query)

		res.writeHead(200, {'Content-Type': 'text/plain'});

		if (path === '/hello' &&  params['name'] === "jean-baptiste")
		{
			res.write('jean-baptiste Crespo createur de cette page, age: 22 ans, mots favoris: Amphigouri ')
		} else if (path === '/hello' && 'name' in params) {
			res.write('Hello ' + params['name'])

		} else if (path === '/') {
			res.write('Ajouter /hello?name=[Votre nom]  pour que la page vous salue')

		} else {
			res.write('ERROR 404: page not found')
		}




		res.end();
	}

}

