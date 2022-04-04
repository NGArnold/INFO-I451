const express = require("express");
const path = require("path");
const data = require("./data-service.js");
const bodyParser = require('body-parser');
const fs = require("fs");
const exphbs = require('express-handlebars');
const app = express();
const mongoose = require("mongoose");


const HTTP_PORT = process.env.PORT || 8030;

app.listen(HTTP_PORT, function () {
    console.log('Node.js listening on port ' + HTTP_PORT);
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
    data.getDepartments().then((data) => {
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

    if (data.length > 0) {
        if (req.query.status) {
            data.getEmployeesByStatus(req.query.status).then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        } else if (req.query.department) {
            data.getEmployeesByDepartment(req.query.department).then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        } else if (req.query.manager) {
            data.getEmployeesByManager(req.query.manager).then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        } else {
            data.getAllEmployees().then((data) => {
                res.render("employees", { employees: data });
            }).catch((err) => {
                res.render("employees", { message: "no results" });
            });
        }

    } else {
        res.render("employees", { message: "no results" });
    }
});

app.get("/employee/:empNum", (req, res) => {
    // initialize an empty object to store the values
    let viewData = {};
    data.getEmployeeByNum(req.params.empNum).then((data) => {
        if (data) {
            viewData.employee = data; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error
    }).then(data.getDepartments)
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
    data.deleteEmployeeByNum(req.params.empNum).then(() => {
        res.redirect('/employees');
    }).catch((errror) => {
        res.status(500).send("Unable to Remove Employee / Employee not found)")
    });
})

app.get("/department/:departmentId", (req, res) => {
    data.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", { department: data });
    }).catch((err) => {
        res.render("department", { message: "no results" });
    });
});

app.get("/department/delete/:departmentId", (req, res) => {
    data.deleteDepartmentById(req.params.departmentId).then((data) => {
        res.redirect("department");
    }).catch((err) => {
        res.render("department", { message: "Unable to remove department/department not found" });
    });
});


app.get("/departments", (req, res) => {
    if (data.length < 0) {
        data.getDepartments().then((data) => {
            res.render("departments", { departments: data });
        });
    } else {
        res.render("departments", { message: "no results" });
    }

});

app.post("/departments/add", (req, res) => {
    data.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});

app.post("/employees/add", (req, res) => {
    data.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});



app.post("/employee/update", (req, res) => {
    data.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.post("/department/update", (req, res) => {
    data.updateDepartment(req.body).then(() => {
        res.redirect("/department");
    });
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


