const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../data/User");

const handleLogin = async (req, res) => {
  const foundUser = await User.findOne({ username: req.body.username });
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
      foundUser.refreshToken = refreshToken;
      await foundUser.save();
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
    pwd: hashedPwd,
  };
  const result = new User(newUser);
  await result.save();
  res.sendStatus(200);
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(404);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.json({ res: "Cookies is cleared." });
  }
  foundUser.refreshToken = "";
  await foundUser.save();
  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.status(200).json({ res: "Cookies is cleared." });
};

module.exports = { handleLogin, handleCreateUser, handleLogout };
