const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({
      message: "access denied!",
    });
  }

  try {
    // const SECRET_KEY = 'apriadiDW'
    // const veried = jwt.verify(token, process.env.TOKEN_KEY);
    const SECRET_KEY = process.env.TOKEN_KEY;
    const veried = jwt.verify(token, SECRET_KEY);

    console.log(process.env.TOKEN_KEY);

    req.user = veried;
    next();
  } catch (error) {
    res.status(400).send({
      message: "invalid token",
    });
  }
};
