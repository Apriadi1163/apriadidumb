const { product, user, category, productCategory } = require("../../models");

exports.addProduct = async (req, res) => {
  try {
    let { categoryId } = req.body;
    if (categoryId) {
      categoryId = categoryId.split(",");
    }
    const data = {
      name: req.body.name,
      des: req.body.des,
      price: req.body.price,
      image: req.file.filename,
      qty: req.body.qty,
      idUser: req.user.id,
    };

    let newProduct = await product.create(data);

    if (categoryId) {
      const productCategory = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });

      await productCategory.bulkCreate(productCategoryData);
    }

    let products = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "createdAd", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    products = JSON.parse(JSON.stringify(products));
    res.status(200).send({
      status: "Success",
      message: "Add Product Success",
      data: {
        ...products,
        image: process.env.PATH_FILE + products.image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "Add Product Failed",
      message: "Server Error",
    });
  }
};

//   try {
//     const newProduct = req.body;
//     let products = await product.create({
//       ...newProduct,
//       image: req.file.filename,
//       idUser: req.user.id,
//     });

//     products = JSON.parse(JSON.stringify(products));

//     products = {
//       ...products,
//       image: process.env.PATH_FILE + products.image,
//     };

//     console.log(products);

//     res.status(200).send({
//       status: "Success",
//       message: "Add Product Success",
//       data: products,
//     });
//   } catch (error) {
//     // console.log(error);
//     console.log(req.user);
//     console.log(error);

//     res.status(500).send({
//       status: "Add Product Failed",
//       message: "Server Error",
//     });
//   }
// };

exports.getProducts = async (req, res) => {
  try {
    let data = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            modul: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
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

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    let data = await product.findOne({
      where: { id },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
        },
        {
          model: category,
          as: "categories",
          through: {
            model: productCategory,
            as: "bridge",
          },
          attributes: {
            exclude: ["idUser", "createdAt", "updatedAt"],
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (req.file) {
      data.image = req.file.filename;
    }
    console.log("BODYYY", data);
    if (Object.keys(data).length < 1) {
      return res.status(500).json({
        error: true,
        data,
      });
    }

    let updateProduct = await product.update(
      {
        ...data,
        idUser: req.user.id,
      },
      { where: { id } }
    );

    updateProduct = JSON.parse(JSON.stringify(data));

    updateProduct = {
      ...updateProduct,
      image: process.env.PATH_FILE + updateProduct.image,
    };

    res.status(200).send({
      status: "Success",
      message: `Update product at id: ${id} success`,
      data: {
        products: updateProduct,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Updated product failed",
      message: "Server Error",
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await product.destroy({
      where: { id },
    });
    res.send({
      status: "success",
      message: `delete id product ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "server error",
    });
  }
};
