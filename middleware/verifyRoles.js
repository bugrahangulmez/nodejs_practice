const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(404);
    const rolesArray = [...allowedRoles];
    console.log("Allowed roles: ", rolesArray);
    console.log("User roles: ", req.roles);
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return res.sendStatus(404);
    next();
  };
};

module.exports = verifyRoles;
