const { profile, user } = require("../../models");

exports.addProfiles = async (req, res) => {
  try {
    let data = req.body;
    data = {
      ...data,
      image: req.file.filename,
      idUser: req.user.id,
    };

    await profile.create(data);

    data = JSON.parse(JSON.stringify(data));

    res.send({
      status: "success  ",
      data: {
        ...data,
        image: process.env.PATH_FILE + data.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;

    let updateProfile = await profile.update(
      {
        ...data,
        image: req?.file?.filename,
      },
      { where: { id: req.user.id } }
    );

    console.log(req.user.id);
    updateProfile = JSON.parse(JSON.stringify(data));

    updateProfile = {
      ...updateProfile,
      image: updateProfile.image
        ? process.env.PATH_FILE + req?.file?.filename
        : null,
    };

    await user.update(req.body, {
      where: {
        id: req.user.id,
      },
    });

    res.status(200).send({
      status: "success",
      message: `update Product success`,
      data: {
        profile: updateProfile,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    let data = await profile.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    // Map
    data = data.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item.image,
      };
    });

    res.status(200).send({
      status: "Success",
      message: "Get data all product success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Failed",
      message: "Server Error",
    });
  }
};

exports.getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await profile.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.PATH_FILE + data.image,
    };

    res.status(200).send({
      status: "Success",
      message: `Get detail product: ${id} success`,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get detail data failed",
      message: "Server Error",
    });
  }
};
