const { category } = require("../../models");

exports.addCategory = async (req, res) => {
  try {
    const data = req.body;
    const createData = await category.create(data);

    res.send({
      status: "success",
      data: createData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      data: {
        categories,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await category.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.send({
      status: "success",
      data: {
        category: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await category.update(req.body, {
      where: { id },
    });
    res.send({
      status: "success",
      message: ` update category id: ${id}`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await category.destroy({
      where: { id },
    });
    res.send({
      status: "success",
      message: `delete id category ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
