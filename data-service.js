var mongoose = require("mongoose");
var Schema = mongoose.Schema;
// connect to Your MongoDB Atlas Database
mongoose.connect("mongodb+srv://luakitch:assignment4@assignments.zccsh.mongodb.net/Assignments?retryWrites=true&w=majority");


const employeeSchema = new Schema({
    employeeNum: Number,
    firstName: String,
    lastName: String,
    email: String,
    SSN: String,
    addressStreet: String,
    addressCity: String,
    addressState: String,
    addressPostal: String,
    maritalStatus: String,
    isManager: Boolean,
    employeeManagerNum: Number,
    status: String,
    hireDate: String,
    author: String,
    department: Number
});

const departmentSchema = new Schema({
    departmentId: Number,
    departmentName: String
});

const Employee = mongoose.model('Employee', employeeSchema);
const Department = mongoose.model('Department', departmentSchema);

module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {

        Employee.find({}).lean().exec()
        .then((data) => {
            resolve(data);
        }).catch((error) => {
            reject("No results returned.");
        });
    });
}

module.exports.addEmployee = function (employeeData) {

    employeeData.isManager = (employeeData.isManager) ? true : false;
    employeeData.employeeNum = Math.floor(1000 + Math.random() * 8999);

    return new Promise(function (resolve, reject) {

        for (const prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }
            Employee.create(employeeData)
            .then(() => {
                resolve();
            }).catch((error) => {
                reject("Unable to create employee.");
            });
    });
    
};


module.exports.getEmployeeByNum = function (num) {
    return new Promise((resolve, reject) => {

        Employee.find({ employeeNum: num }).lean().exec()
        .then((data) => {
            resolve(data[0]);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise((resolve, reject) => {
        
        Employee.find({ status: status }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};


module.exports.getEmployeesByDepartment = function (department) {
    return new Promise((resolve, reject) => {

        Employee.find({ department: department }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise((resolve, reject) => {

        Employee.find({ employeeManagerNum: manager }).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        reject();
    });
};

module.exports.updateEmployee = function (employeeData) {

    employeeData.isManager = (employeeData.isManager) ? true : false;

    return new Promise(function (resolve, reject) {
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
        }

        Employee.updateOne({employeeNum: employeeData.employeeNum},
             {firstName: employeeData.firstName,
             lastName: employeeData.lastName,
             email: employeeData.email,
             SSN: employeeData.SSN,
             addressStreet: employeeData.addressStreet,
             addressCity: employeeData.addressCity,
             addressState: employeeData.addressState,
             addressPostal: employeeData.addressPostal,
             maritalStatus: employeeData.maritalStatus,
             isManager: employeeData.isManager,
             employeeManagerNum: employeeData.employeeManagerNum,
             status: employeeData.status,
             hireDate: employeeData.hireDate,
             author: employeeData.author,
             department: employeeData.department}
             ).then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to update employee.");
        });
    });
};

module.exports.deleteEmployeeByNum = function (empNum) {
    return new Promise((resolve, reject) => {

        Employee.deleteOne({ employeeNum: empNum }).exec()
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to delete employee.");
        });
    });
};

module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {

        Department.find({}).lean().exec()
        .then((data) => {
            resolve(data);

        }).catch((error) => {
            reject("No results returned.");
        });
        
    });
}

module.exports.getDepartmentById = function (id) {
    return new Promise((resolve, reject) => {

        Department.find({ departmentId: id }).lean().exec()
        .then((data) => {
            resolve(data[0]);

        }).catch((error) => {
            reject("No results returned.");
        });
    });
};

module.exports.deleteDepartmentById = function (id) {
    return new Promise((resolve, reject) => {

        Department.deleteOne({ departmentId: id }).exec()
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to delete department.");
        });
    });
};

module.exports.addDepartment = function (departmentData) {

    return new Promise(function (resolve, reject) {

        for (const prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }

        Department.create(departmentData)
        .then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to create department.");
        });
    });

};

module.exports.updateDepartment = function (departmentData) {

    return new Promise(function (resolve, reject) {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }

        Department.updateOne({departmentId: departmentData.departmentId}, {departmentName: departmentData.departmentName}).then(() => {
            resolve();

        }).catch((error) => {
            reject("Unable to update department.");
        });
    });
};