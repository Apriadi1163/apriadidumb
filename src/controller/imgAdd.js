const { pica } = require("../../models");

exports.changepic = async (req, res) => {
  try {
    const newProduct = req.body;
    let products = await pica.create({
      ...newProduct,
      image: req.file.filename,
    });

    products = JSON.parse(JSON.stringify(products));

    products = {
      ...products,
      image: process.env.PATH_FILE + products.image,
    };

    res.status(200).send({
      status: "Success",
      message: "Add Product Success",
      data: products,
    });
  } catch (error) {
    // console.log(error);
    console.log(req.user);

    res.status(500).send({
      status: "Add Product Failed",
      message: "Server Error",
    });
  }
};
