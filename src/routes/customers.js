const express = require("express");
const router = express.Router();
const {
getCustomersByUser,
addCustomer,
addPayment,
addPurchase,
deleteCustomer
} = require("../controllers/customers");

router.get("/getCustomersByUser/:userId", getCustomersByUser);
router.post("/addCustomer", addCustomer);
router.post("/addPayment", addPayment);
router.post("/addPurchase", addPurchase);
router.delete("/deleteCustomer/:id", deleteCustomer);

module.exports = router;