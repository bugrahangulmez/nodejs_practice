const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");
const usersDB = {
  users: require("../data/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(404);
  const refreshToken = cookies.jwt;
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === cookies.jwt
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.json({ res: "Cookies is cleared." });
  }
  const newUsers = usersDB.users.map((person) => {
    if (person.refreshToken === refreshToken) {
      return { ...foundUser, refreshToken: "" };
    } else return person;
  });
  usersDB.setUsers(newUsers);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "data", "users.json"),
    JSON.stringify(usersDB.users),
    "utf8"
  );
  res.status(200).json(usersDB.users);
};

module.exports = { handleLogout };
