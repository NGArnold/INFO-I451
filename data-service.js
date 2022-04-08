// data-service

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// connect to MDB Atlas Database

mongoose.connect("mongodb+srv://user1:admin@assignment4-cluster.eymrh.mongodb.net/Assignment4-Cluster?retryWrites=true&w=majority");

// define schema

const employeeSchema = new Schema ({

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
})

const departmentSchema = new Schema ({

    departmentId: Number,
    departmentName: String,
})

const Employee = mongoose.model('Employee', employeeSchema);
const Department = mongoose.model('Department', departmentSchema);

module.exports.getAllEmployees = () => {
    return new Promise((resolve,reject) => {
       Employee.find({})
        .lean()
            .exec()
                .then((data) => {
                    resolve(data);
                }) .catch((error) => {
                        reject("Employee not found.");
                });
            });
}

// addEmployee Function

module.exports.addEmployee = (employeeData) => {

    employeeData.isManager = (employeeData.isManager) ? true : false;
    employeeData.employeeNum = Math.floor(1000 + Math.random() * 2333);

    return new Promise((resolve, reject) => {
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
    }

    Employee.create(employeeData)
        .then(() => {
            resolve();
        })
        .catch((error) => {
            reject("Employee unable to be created.");
        });
});
};

// getEmployeeByNum Function

module.exports.getEmployeeByNum = (num) => {

   return new Promise((resolve, reject) => {
        Employee.find({ employeeNum: num })
            .lean()
                .exec()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("No employees found by number.");
                    });
    });
};

// getEmployeeByStatus function

module.exports.getEmployeeByStatus = (status) => {
    
    return new Promise((resolve, reject) => {
        Employee.find({ status: status })
            .lean()
                .exec()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("No employee found by status.");
                    });
    });
};

//getEmployeeByDepartment function

module.exports.getEmployeeByDepartment = (department) => {
    
    return new Promise((resolve, reject) => {
        Employee.find({ department: department })
            .lean()
                .exec()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("Employee could not be found by department.");
                    });
    });
};

// getEmployeeByManager function

module.exports.getEmployeeByManager = (manager) => {

    return new Promise((resolve, reject) => {
        Employee.find({ employeeManagerNum: manager })
        .lean()
            .exec()
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject("Employee could not be found by manager.");
                });
    });
};

// getManagers Function

module.exports.getManagers = (isManager) => {

    return new Promise((resolve, reject) => {
        Employee.find({ isManager: isManager})
            .lean()
                .exec()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("No managers found.");
                    });
    });
};

// getDepartments Function

module.exports.getDepartments = () => {

    return new Promise((resolve, reject) => {
        Department.find({})
            .lean()
                .exec()
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject("No departments found.");
                    });
    });
};

// updateEmployee Function

module.exports.updateEmployee = (employeeData) => {

    employeeData.isManager = (employeeData.isManager) ? true : false;
    
    return new Promise((resolve, reject) => {
        for (const prop in employeeData) {
            if (employeeData[prop] == "") {
                employeeData[prop] = null;
            }
    }

    Employee.updateOne({employeeNum: employeeData.employeeNum}, {firstName: employeeData.firstName}, {lastName: employeeData.lastName}, {email: employeeData.email}, {SSN: employeeData.SSN}, {addressStreet: employeeData.addressStreet}, {addressCity: employeeData.addressCity}, 
        {addressState: employeeData.addressState}, {addressPostal: employeeData.addressPostal}, {maritalStatus: employeeData.maritalStatus}, {isManager: employeeData.isManager}, {employeeManagerNum: employeeData.employeeManagerNum}, {status: employeeData.status}, {hireDate: employeeData.hireDate})
        .then(() => {
            resolve();
        })
        .catch((error) => {
            reject("Employee update failed.");
        });
});
};

module.exports.deleteEmployeeByNum = (delEmpNum) => {
    return new Promise((resolve, reject) => {

        Employee.deleteOne({ employeeNum: delEmpNum })
        .exec()
            .then(() => {
                resolve();
                })
                .catch((error) => {
                    reject("Unable to delete employee.");
        });
    });
};

module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {

        Department.find({ departmentId: id })
        .lean()
            .exec()
                .then((data) => {
                    resolve(data[0]);
                })
                .catch((error) => {
                    reject("No results returned.");
        });
    });
};

module.exports.deleteDepartmentById = (delId) => {
    return new Promise((resolve, reject) => {

        Department.deleteOne({ departmentId: delId })
            .exec()
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject("Unable to delete department.");
                });
    });
};

module.exports.addDepartment = (departmentData) => {

    return new Promise((resolve, reject) => {

        for (const prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }

        Department.create(departmentData)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject("Unable to create department.");
            });
    });

};

module.exports.updateDepartment = (departmentData) => {

    return new Promise((resolve, reject) => {
        for (const prop in departmentData) {
            if (departmentData[prop] == "") {
                departmentData[prop] = null;
            }
        }

        Department.updateOne({departmentId: departmentData.departmentId}, {departmentName: departmentData.departmentName})
        .then(() => {
            resolve();
        })
        .catch((error) => {
            reject("Unable to update department.");
        });
    });
};
