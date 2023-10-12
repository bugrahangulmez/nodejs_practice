const router = require("express").Router();
const bcrypt = require("bcrypt");
const users = require("../data/users.json");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");
const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const foundUser = users.find(
    (person) => person.username === req.body.username
  );
  if (foundUser) {
    const matched = await bcrypt.compare(req.body.pwd, foundUser.pwd);
    if (matched) {
      const roles = Object.values(foundUser.roles);
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      const refreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const newEmployees = usersDB.users.map((person) => {
        if (person.username === foundUser.username) {
          return { ...foundUser, refreshToken };
        } else return person;
      });
      usersDB.setUsers(newEmployees);
      await fsPromises.writeFile(
        path.join(__dirname, "..", "data", "users.json"),
        JSON.stringify(usersDB.users),
        "utf8"
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    }
  }
};

const handleCreateUser = async (req, res) => {
  const hashedPwd = await bcrypt.hash(req.body.pwd, 10);
  const newUser = {
    username: req.body.username,
    roles: {
      User: 300,
    },
    pwd: hashedPwd,
  };
  usersDB.setUsers([...usersDB.users, newUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(usersDB.users),
    "utf8"
  );
  res.json(usersDB.users);
};

module.exports = { handleLogin, handleCreateUser };
