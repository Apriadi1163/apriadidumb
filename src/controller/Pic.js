const { pica } = require("../../models");

exports.updatePic = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.file.filename;
    let updatePic = await pica.update(
      {
        ...data,
        idUser: req.user.id,
      },
      { where: { id } }
    );

    updatePic = JSON.parse(JSON.stringify(data));

    updatePic = {
      ...updatePic,
      image: process.env.PATH_FILE + updatePic.image,
    };

    res.status(200).send({
      status: "Success",
      message: `Update product at id: ${id} success`,
      data: {
        pica: updatePic,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Updated picture failed",
      message: "Server Error",
    });
  }
};

exports.addPic = async (req, res) => {
  try {
    let data = req.body;
    const addPic = await pica.create({
      ...data,
    });

    updatePic = JSON.parse(JSON.stringify(addPic));

    updatePic = {
      ...updatePic,
      image: process.env.PATH_FILE + updatePic.image,
    };

    console.log(updatePic);

    res.status(200).send({
      status: "Success",
      message: "Add profile success",
      data: {
        profile: {
          addProfile,
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
