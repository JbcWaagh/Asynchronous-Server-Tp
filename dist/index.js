"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.set('port', 8080);
app.listen(app.get('port'), function () { return console.log("server listening on " + app.get('port')); });
app.get('/', function (req, res) { return res.send('Ajouter /hello/[Votre nom]  pour que la page vous salue'); });
app.get('/hello/:name', function (req, res) {
    if (req.params.name == 'jean-baptiste') {
        res.send('jean-baptiste Crespo createur de cette page, age: 22 ans, mots favoris: Amphigouri ');
    }
    else {
        res.send("Hello " + req.params.name);
    }
});
app.use(function (req, res) {
    res.send('ERROR 404: page not found');
});
