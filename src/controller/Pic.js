const { pica, user } = require("../../models");

exports.addPicture = async (req, res) => {
  try {
    const data = req.body;
    let newData = await pica.create({
      ...data,
      image: req.file.filename,
      idUser: req.user.id,
    });

    newData = JSON.parse(JSON.stringify(newData));

    newData = {
      ...newData,
      image: process.env.PATH_FILE + newData.image,
    };

    res.status(200).send({
      status: "success",
      message: "add picture success",
      data: newData,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updatePicture = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    let dataPic = await pica.update(
      {
        ...data,
        image: req.file.filename,
        idUser: req.user.id,
      },
      { where: { id } }
    );

    dataPic = JSON.parse(JSON.stringify(data));

    dataPic = {
      ...dataPic,
      image: process.env.PATH_FILE + dataPic.image,
    };

    res.status(200).send({
      status: "success",
      message: `update picture at id: ${id} success`,
      dataPic,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getPictures = async (req, res) => {
  try {
    let data = await pica.findAll({
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
    data = data.map((item) => {
      return {
        ...item,
        image: process.env.PATH_FILE + item.image,
      };
    });

    res.status(200).send({
      status: "success",
      message: "get data all pictures",
      data,
    });
  } catch (error) {
    console.log(error);
  }
};
