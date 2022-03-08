const fs = require("fs");

var employees = [];
var departments = [];

module.exports.getEmployeeByNum = function (num) {
    var locEmp;
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                locEmp = employees[i];
                i = employees.length;
            }
        }

        if (locEmp === "undefined") {
            var err = "getEmployeesByNum() does not have any data.";
            reject({message: err});
        }

    resolve (locEmp);
    })
    return promise;
};

module.exports.getEmployeesByStatus = function (statusId) {
    var locEmp = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].status == statusId) {
                locEmp.push(employees[i]);
            }
        }

        if (locEmp.length === 0) {
            var err = "getEmployeesByStatus() does not have any data.";
            reject({message: err});
        }

    resolve (locEmp);
    })
    return promise;
};

module.exports.getEmployeesByDepartment = function (departmentId) {
    var locEmp = [];
    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].department == departmentId) {
                locEmp.push(employees[i]);
            }
        }

        if (locEmp.length === 0) {
            var err = "getEmployeesByDepartment() does not have any data.";
            reject({message: err});
        }

    resolve (locEmp);
    })
    return promise;
};

module.exports.getEmployeeByManager = function (managerBool) {
    var locEmp = [];
    var myTrue = managerBool == "true" ? true:false;

    var promise = new Promise((resolve, reject) => {

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].isManager === myTrue) {
                locEmp.push(employees[i]);
            }
        }

        if (locEmp.length === 0) {
            var err = "getEmployeesByManager() does not have any data.";
            reject({message: err});
        }

    resolve (locEmp);
    })
    return promise;
};

module.exports.addEmployee = function(employeeData) {

    var promise = new Promise((resolve, reject) => {

        if (typeof employeeData.isManager === "undefined") {
            employeeData.isManager = false;
        } else {
            employeeData.isManager = true;
        }

        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);

        resolve (employees);
    })

    return promise;
}

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

