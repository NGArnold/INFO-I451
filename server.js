const express = require("express");
const path = require("path");
const dataServ = require("./data-service.js");
const bodyParser = require('body-parser');
const fs = require("fs");
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require("mongoose");


const HTTP_PORT = process.env.PORT || 8080;

app.listen(HTTP_PORT, function () {
    console.log('Node.js listening on port: ' + HTTP_PORT);
});

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: "main",
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));

app.set('view engine', '.hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/images/add", (req, res) => {
    res.render("addImage");
});

app.get("/employees/add", (req, res) => {
    dataServ.getDepartments().then((data) => {
        res.render('addEmployee', { departments: data });
    }).catch((error) => {
        res.render("addEmployee", { departments: [] });
    });
});

app.get("/departments/add", (req, res) => {
    res.render("addDepartment");
});

app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, items) {
        res.render("images", { images: items });
    });
});


app.get("/employees", (req, res) => {

        if (req.query.status) {
            dataServ.getEmployeesByStatus(req.query.status).then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        } else if (req.query.department) {
            dataServ.getEmployeesByDepartment(req.query.department).then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        } else if (req.query.manager) {
            dataServ.getEmployeesByManager(req.query.manager).then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        } else {
            dataServ.getAllEmployees().then((data) => {
                if (data.length > 0) {
                    res.render('employees', { employees: data });
                }
                else {
                    res.render('employees', { message: "no results" });
                }
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        }
});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    dataServ.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(dataServ.getDepartments)
        .then((data) => {
            viewData.departments = data; // store department data in the "viewData" object as "departments"
            // loop through viewData.departments and once we have found the departmentId that matches
            // the employee's "department" value, add a "selected" property to the matching
            // viewData.departments object
            for (let i = 0; i < viewData.departments.length; i++) {
                if (viewData.departments[i].departmentId == viewData.employee.department) {
                    viewData.departments[i].selected = true;
                }
            }
        }).catch(() => {
            viewData.departments = []; // set departments to empty if there was an error
        }).then(() => {
            if (viewData.employee == null) { // if no employee - return an error
                res.status(404).send("Employee Not Found");
            } else {
                res.render("employee", { viewData: viewData }); // render the "employee" view
            }
        });
});

app.get('/employees/delete/:empNum', (req, res) => {
    dataServ.deleteEmployeeByNum(req.params.empNum).then(() => {
        res.redirect('/employees');
    }).catch((error) => {
        res.status(500).send("Unable to Remove Employee / Employee not found)");
    });
})

app.get("/department/:departmentId", (req, res) => {
    dataServ.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", { department: data });
    }).catch((err) => {
        res.render("department", { message: "no results" });
    });
});

app.get("/departments/delete/:departmentId", (req, res) => {
    dataServ.deleteDepartmentById(req.params.departmentId).then((data) => {
        res.redirect("/departments");
    }).catch((err) => {
        res.status(500).send("Unable to remove department/department not found");
    });
});


app.get("/departments", (req, res) => {

        dataServ.getDepartments().then((data) => {
            if (data.length > 0) {
                
                res.render('departments', { departments: data });
            }
            else {
                res.render('departments', { message: "no results" });
            }
        }).catch((error) => {
            res.render('departments', { message: "no results" });
        });

});

app.post("/departments/add", (req, res) => {
    dataServ.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    }).catch((err) => {
        console.log("Department did not add correctly")
    });
});

app.post("/employees/add", (req, res) => {
    dataServ.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.post("/employee/update", (req, res) => {
    dataServ.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.post("/department/update", (req, res) => {
    dataServ.updateDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


