const { transaction, user, product, profile } = require("../../models");
const midtransClient = require("midtrans-client");

// exports.getTransactions = async (req, res) => {
//   try {
//     const data = await transaction.findAll({
//       attributes: {
//         exclude: ["idProduct", "idBuyer", "idSeller", "createdAt", "updatedAt"],
//       },
//       include: [
//         {
//           model: product,
//           as: "product",
//           attributes: {
//             exclude: [
//               "desc",
//               "price",
//               "qty",
//               "idUser",
//               "createdAt",
//               "updatedAt",
//             ],
//           },
//         },
//         {
//           model: user,
//           as: "buyer",
//           attributes: {
//             exclude: ["password", "idUser", "createdAt", "updatedAt"],
//           },
//         },
//         {
//           model: user,
//           as: "seller",
//           attributes: {
//             exclude: ["password", "idUser", "createdAt", "updatedAt"],
//           },
//         },
//       ],
//     });

//     res.status(200).send({
//       status: "Get data Transaction Success",
//       data,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(404).send({
//       status: "Get data Transactions Failed",
//       message: "Server Error",
//     });
//   }
// };

exports.getTransactions = async (req, res) => {
  try {
    let data = await transaction.findAll({
      attributes: {
        exclude: ["idProduct", "idBuyer", "idSeller", "updatedAt"],
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["desc", "qty", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "buyer",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        product: {
          ...item.product,
          image: process.env.PATH_FILE + item.product.image,
        },
      };
    });

    res.status(200).send({
      status: "Get data Transaction Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Transactions Failed",
      message: "Server Error",
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const idBuyer = req.user.id;
    let data = await transaction.findAll({
      where: {
        idBuyer, //? untuk apa?
      },
      order: [["createdAt", "DESC"]], //? untuk apa?
      attributes: {
        exclude: ["idProduct", "idBuyer", "idSeller", "updatedAt"],
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["desc", "qty", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "buyer",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["password", "idUser", "createdAt", "updatedAt"],
          },
        },
      ],
    });

    data = JSON.parse(JSON.stringify(data));

    data = data.map((item) => {
      return {
        ...item,
        product: {
          ...item.product,
          image: process.env.PATH_FILE + item.product.image,
        },
      };
    });

    res.status(200).send({
      status: "Get data Transaction Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      status: "Get data Transactions Failed",
      message: "Server Error",
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    let data = req.body;
    data = {
      id: parseInt(data.idProduct + Math.random().toString().slice(3, 8)),
      ...data,
      idBuyer: req.user.id,
      status: "pending",
    };

    const newData = await transaction.create(data);

    //get buyer data here..
    const buyerData = await user.findOne({
      include: {
        model: profile,
        as: "profile",
        attributes: {
          exclude: ["createdAt", "updatedAt", "idUser"],
        },
      },
      where: {
        id: newData.idBuyer,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    //create snap API instance here
    let snap = new midtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    //create parameter for snap API here
    let parameter = {
      transaction_details: {
        order_id: newData.id,
        gross_amount: newData.price,
      },
      credit_card: {
        secure: true,
      },
      customer_details: {
        full_name: buyerData?.name,
        email: buyerData?.email,
        phone: buyerData?.profile?.phone,
      },
    };

    //create transaction token & redirect_url
    const payment = await snap.createTransaction(parameter);
    console.log(payment);

    res.send({
      status: "pending",
      message: "Pending transaction payment gateway",
      payment,
      product: {
        id: data.idProduct,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

//create configure midtrans
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const core = new midtransClient.CoreApi();

core.apiConfig.set({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});

//create function for handle
exports.notification = async (req, res) => {
  try {
    const statusResponse = await core.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(statusResponse);

    if (transactionStatus == "capture") {
      if (fraudStatus == "challenge") {
        // TODO set transaction status on your database to 'challenge'
        // and response with 200 OK
        updateTransaction("pending", orderId);
        res.status(200);
      } else if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        updateProduct(orderId);
        updateTransaction("success", orderId);
        res.status(200);
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK
      updateTransaction("success", orderId);
      res.status(200);
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      updateTransaction("failed", orderId);
      res.status(200);
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      updateTransaction("pending", orderId);
      res.status(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

//create update transaction
const updateTransaction = async (status, transactionId) => {
  await transaction.update(
    {
      status,
    },
    {
      where: {
        id: transactionId,
      },
    }
  );
};

//create function for handle product
const updateProduct = async (orderId) => {
  const transactionData = await transaction.findOne({
    where: {
      id: orderId,
    },
  });
  const productData = await product.findOne({
    where: {
      id: transactionData.idProduct,
    },
  });
  const qty = productData.qty - 1;
  await product.update({ qty }, { where: { id: productData.id } });
};
