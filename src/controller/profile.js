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
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.image = req.file.filename;
    }

    let updateProfile = await profile.update(
      {
        ...data,
        idUser: req.user.id,
      },
      { where: { id } }
    );

    updateProfile = JSON.parse(JSON.stringify(data));

    updateProfile = {
      ...updateProfile,
      image: process.env.PATH_FILE + updateProfile.image,
    };

    res.status(200).send({
      status: "Success",
      message: `Update profile at id: ${id} success`,
      data: {
        profile: updateProfile,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Updated profile failed",
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
