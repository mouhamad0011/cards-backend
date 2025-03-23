const express = require("express");
const router = express.Router();
const {
getCustomersByUser,
addCustomer,
addPayment,
addPurchase,
deleteCustomer,
editCustomer
} = require("../controllers/customers");

router.get("/getCustomersByUser/:userId", getCustomersByUser);
router.post("/addCustomer", addCustomer);
router.post("/addPayment", addPayment);
router.post("/addPurchase", addPurchase);
router.post("/editCustomer", editCustomer);
router.delete("/deleteCustomer/:id", deleteCustomer);

module.exports = router;