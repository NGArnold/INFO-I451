const fs = require("fs");

var employees = [];
var departments = [];

module.exports.initialize = function() {
    var promise = new Promise((resolve, reject) => {
        try {
            
            fs.readFile('./data/employees.json', (err, data) => {
                if (err) throw err;

                employees = JSON.parse(data);
                console.log("Initialize: load employees")
            })
            
            fs.readFile('./data/departments.json', (err, data) => {
                if (err) throw err;

                departments = JSON.parse(data);
                console.log("Initialize: load departments");
            })

        } catch (ex) {
            console.log("Initialize: Failure");
            reject("Initialize: Failure");
        }
        console.log("Initialize: Success");
        resolve("Initialize: Success");
    })
    return promise;
};

module.exports.getAllEmployees = function() {
    var promise = new Promise((resolve, reject) => {

        if (employees.length === 0) {
            var err = "No results returned in getAllEmployees";
            reject({message: err});
        }
        resolve (employees);
    })
    return promise;
};


module.exports.getManagers = function() {
    var managers = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager == true) {
                managers.push(employees[i]);
            }
        }

        if (managers.length === 0) {
            var err = "No results returned in getManagers()";
            reject({message: err});
        }

    resolve(managers);
    })

    return promise;
};

module.exports.getDepartments = function() {

    var promise = new Promise((resolve, reject) => {
        if(departments.length === 0) {
            var err = "No results returned in getDepartments()";
            reject({message: err});
        }
    
        resolve(departments);
    })

    return promise;
}