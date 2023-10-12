const router = require("express").Router();
const fsPromises = require("fs").promises;
const path = require("path");
const employeesDB = {
  employees: require("../data/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getEmployee = (req, res) => {
  res.json(employeesDB.employees);
};

const createEmployee = async (req, res) => {
  const lastEmployee = employeesDB.employees[employeesDB.employees.length - 1];
  class Employee {
    constructor(id, firstname, lastname, age) {
      (this.id = id),
        (this.firstname = firstname),
        (this.lastname = lastname),
        (this.age = age);
    }
  }
  let newEmployee;
  if (lastEmployee) {
    newEmployee = new Employee(
      lastEmployee.id + 1,
      req.body.firstname,
      req.body.lastname,
      req.body.age
    );
  } else {
    newEmployee = new Employee(
      1,
      req.body.firstname,
      req.body.lastname,
      req.body.age
    );
  }
  console.log(employeesDB.employees);
  employeesDB.setEmployees([...employeesDB.employees, newEmployee]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "employees.json"),
    JSON.stringify(employeesDB.employees),
    "utf8"
  );
  res.json(employeesDB.employees);
};

const deleteEmployee = async (req, res) => {
  const newEmployees = employeesDB.employees.filter(
    (person) => person.id !== req.body.id
  );
  employeesDB.setEmployees(newEmployees);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "employees.json"),
    JSON.stringify(employeesDB.employees),
    "utf8"
  );
  res.json(employeesDB.employees);
};

const editEmployee = async (req, res) => {
  const newEmployees = employeesDB.employees.map((person) => {
    if (person.id === req.body.id) {
      return {
        id: person.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
      };
    } else return person;
  });
  employeesDB.setEmployees(newEmployees);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "employees.json"),
    JSON.stringify(employeesDB.employees),
    "utf8"
  );
  res.json(employeesDB.employees);
};

module.exports = {
  getEmployee,
  createEmployee,
  deleteEmployee,
  editEmployee,
};
