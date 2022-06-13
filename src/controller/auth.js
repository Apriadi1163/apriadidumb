// const { user } = require("../../models");
// const Joi = require("joi");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");

// exports.registration = async (req, res) => {
//   const construction = Joi.object({
//     name: Joi.string().min(5).required(),
//     email: Joi.string().email().min(5).required(),
//     password: Joi.string().min(5).required(),
//   });

//   const { error } = construction.validate(req.body);
//   if (error)
//     return res.status(400).send({
//       error: {
//         meesage: error.details[0].message,
//       },
//     });
//   try {
//     const encryption = await bcrypt.genSalt(10);

//     const encryptionProcess = await bcrypt.hash(req.body.password, encryption);
//     const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);

//     const newValue = await user.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: encryptionProcess,
//       status: "customer",
//       token,
//       idUser: user.id,
//     });

//     res.status(200).send({
//       status: "success",
//       data: {
//         name: newValue.name,
//         email: newValue.email,
//         token,
//         //idUser,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: "failed",
//       message: "server error",
//     });
//   }
// };

// exports.login = async (req, res) => {
//   const construction = Joi.object({
//     email: Joi.string().email().min(5).required(),
//     password: Joi.string().min(5).required(),
//   });

//   const { error } = construction.validate(req.body);
//   if (error)
//     return res.status(400).send({
//       error: {
//         message: error.details[0].message,
//       },
//     });

//   try {
//     const userExist = await user.findOne({
//       where: {
//         email: req.body.email,
//       },
//       attributes: {
//         exclude: ["createdAt", "updatedAt"],
//       },
//     });

//     const isValid = await bcrypt.compare(req.body.password, userExist.password);

//     if (!isValid) {
//       return res.status(400).send({
//         status: "failed",
//         message: "credintial is invalid",
//       });
//     }

//     const dataToken = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);
//     console.log(dataToken);
//     const SECRET_KEY = process.env.TOKEN_KEY;
//     const token = jwt.sign(dataToken, SECRET_KEY);
//     console.log(token);
//     // const token = jwt.sign(dataToken, SECRET_KEY);
//     res.status(200).send({
//       status: "success",
//       data: {
//         id: userExist.id,
//         name: userExist.name,
//         email: userExist.email,
//         token,
//         status: userExist.status,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: "failed",
//       message: "server error",
//     });
//   }
// };

// exports.checkAuth = async (req, res) => {
//   try {
//     const id = req.user.id;

//     const dataUser = await user.findOne({
//       where: id,

//       attributes: {
//         exclude: ["createdAt", "updatedAt", "password"],
//       },
//     });

//     if (!dataUser) {
//       return res.status(404).send({
//         status: "failed",
//       });
//     }
//     res.send({
//       status: "success...",
//       data: {
//         user: {
//           id: dataUser.id,
//           name: dataUser.name,
//           email: dataUser.email,
//           status: dataUser.status,
//         },
//       },
//     });
//   } catch (error) {
//     console.log(error);

//     res.status({
//       status: "failed",
//       message: "Server Error",
//     });
//   }
// };

const { user, profile } = require("../../models");

const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().min(5).required(),
    password: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });
  }

  try {
    // Cek Email
    const email = await user.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (email) {
      return res.status(401).send({
        status: "failed",
        message: "Email telah terdaftar",
      });
    }

    // Hashed Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Tambah user
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      status: "customer",
    });

    // Json Web Token
    const token = jwt.sign({ id: newUser.id }, process.env.TOKEN_KEY);

    res.status(201).send({
      status: "Success",
      message: "Register success",
      data: {
        name: newUser.name,
        email: newUser.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  //Validation
  const schema = Joi.object({
    email: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).send({
      message: error.details[0].message,
    });
  }

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      include: [
        {
          model: profile,
          as: "profile",
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // Check Email
    if (!userExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email belum terdaftar",
      });
    }

    // Check Password
    const isValid = await bcrypt.compare(req.body.password, userExist.password);
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "Password Salah",
      });
    }

    // Json Web Token
    const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "Success",
      message: "Berhasil Login",
      data: {
        name: userExist.name,
        email: userExist.email,
        status: userExist.status,
        profile: userExist.profile,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Failed",
      message: "Server Error",
    });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const id = req.user.id;

    const dataUser = await user.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!dataUser) {
      return res.status(404).send({
        status: "Failed",
      });
    }

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          name: dataUser.name,
          email: dataUser.email,
          status: dataUser.status,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Server Error",
    });
  }
};
