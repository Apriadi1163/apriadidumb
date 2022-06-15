const express = require("express");
require("dotenv").config();
const { route } = require("express/lib/application");

const router = express.Router();

const {
  addUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controller/user");
const {
  // addProfile,
  addProfiles,
  getProfiles,
  getProfile,
  updateProfile,
  // deleteProfile,
} = require("../controller/profile");
const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/product");
const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category");
const {
  addTransaction,
  getTransactions,
  getTransaction,
  notification,
} = require("../controller/transaction");
const { login, checkAuth, register } = require("../controller/auth");
const { auth } = require("../middleware/auth");
const { uploadFile } = require("../middleware/uploadFile");
// const { changepic } = require("../controller/imgAdd");
const { addPicture, updatePicture, getPictures } = require("../controller/Pic");

router.post("/user", addUser);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.get("/profiles", getProfiles);
router.post("/profiles", auth, uploadFile("image"), addProfiles);
router.get("/profile/:id", getProfile);
router.patch("/profile/:id", auth, uploadFile("image"), updateProfile);
// router.delete("/profile/:id", deleteProfile);

router.post("/product", auth, uploadFile("image"), addProduct);
router.get("/products", auth, getProducts);
router.get("/product/:id", getProduct);
router.patch("/product/:id", auth, uploadFile("image"), updateProduct);
router.delete("/product/:id", deleteProduct);

router.post("/category", addCategory);
router.get("/categories", auth, getCategories);
router.get("/category/:id", getCategory);
router.patch("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

router.post("/transaction", auth, addTransaction);
router.get("/transactions", auth, getTransactions);
router.get("/transaction", getTransaction);
router.post("/notification", notification);

router.post("/registration", register);
router.post("/login", login);
router.get("/checkauth", auth, checkAuth);

// router.post("/editpic", uploadFile("image"), changepic);
router.post("/addpicture", auth, uploadFile("image"), addPicture);
router.patch("/updatepicture/:id", auth, uploadFile("image"), updatePicture);
router.get("/pictures", getPictures);

module.exports = router;
