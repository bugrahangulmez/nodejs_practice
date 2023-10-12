const Employee = require("../data/Employee");

const getEmployee = async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
};

const createEmployee = async (req, res) => {
  const result = await Employee.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
  });
  res.status(200).json(result);
};

const deleteEmployee = async (req, res) => {
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  const result = employee.deleteOne();
  res.json(result);
};

const editEmployee = async (req, res) => {
  const employee = await Employee.findOne({ _id: req.body.id });
  if (req?.body?.firstname) employee.firstname = req.body.firstname;
  if (req?.body?.lastname) employee.lastname = req.body.lastname;
  if (req?.body?.age) employee.age = req.body.age;
  const result = await employee.save();
  res.status(200).json(result);
};

module.exports = {
  getEmployee,
  createEmployee,
  deleteEmployee,
  editEmployee,
};
