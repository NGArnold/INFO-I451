const path = require("path");
const express = require("express");
var dataService = require("./data-service.js");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

const HTTP_PORT = process.env.PORT || 8000;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.use(express.static('public/css'));

//_______________________________________________________________________
//Image uploader
const imgPath = "/public/images/uploaded";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, imgPath))
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

app.post("/images/add", upload.single("imageFile"), function(req, res) {
    res.redirect("/images");
});

app.get("/images", function (req, res){
    fs.readdir(path.join(__dirname, imgPath), function(err, items) {

        var obj = {images: []};
        var size = items.length;
        for (var i = 0; i <items.length; i++) {
            obj.images.push(items[i]);
        }
        res.json(obj);
    })
});

//_______________________________________________________________________
//Add Employees

app.use(bodyParser.urlencoded({extended: true}));

app.post("/employees/add", function (req, res) {
    dataService.addEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        });
});

//_______________________________________________________________________
app.get("/", function(req,res) {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/employees/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.get("/images/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

//_______________________________________________________________________
//Employee Value Route

app.get("/employees/:num", function (req, res) {
    dataService.getEmployeeByNum(req.params.num)
    .then((data) => {
        res.json(data);
    })
    .catch((err) => {
        console.log(err);
        res.json(err);
    })
});

app.get("/employees", function(req, res){
    
    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            })
    }
    else if (req.query.department) {
        dataService.getEmployeesByDepartment(req.query.department)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            })
    }
    else if (req.query.isManager) {
        dataService.getEmployeesByManager(req.query.isManager)
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                res.json(err);
            })
    }
    else {
        dataService.getAllEmployees()
            .then((data) => {
                console.log("getAllEmployees JSON");
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.json(err);
            });
    }
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
