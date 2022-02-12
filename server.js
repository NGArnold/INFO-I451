var path = require("path");
var express = require("express");
var dataService = require("./data-service.js");

var app = express();

var HTTP_PORT = process.env.PORT || 8000;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public'));

app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees", function(req, res){
    dataService.getAllEmployees()
            .then((data) => {
                console.log("getAllEmployees JSON");
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
});

app.get("/managers", function(req, res){
    dataService.getManagers()
            .then((data) => {
                console.log("getManagers JSON");
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
});

app.get("/departments", function(req, res){
    dataService.getDepartments()
            .then((data) => {
                console.log("getDepartments JSON");
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
});

app.get('*', function(req, res){
    res.status(404).send('404 PAGE NOT FOUND');
});

dataService.initialize()
            .then(() => {
                console.log ("initialize.then");
                app.listen(HTTP_PORT, onHttpStart);
            })
            .catch(err => {
                console.log(err);
            });
