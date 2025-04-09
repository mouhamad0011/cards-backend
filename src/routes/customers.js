const express = require("express");
const router = express.Router();
const {
getCustomersByUser,
addCustomer,
addPayment,
addPurchase,
deleteCustomer,
editCustomer,
clearTransactionsHistory,
editTransaction,
deleteTransaction
} = require("../controllers/customers");

router.get("/getCustomersByUser/:userId", getCustomersByUser);
router.post("/addCustomer", addCustomer);
router.post("/addPayment", addPayment);
router.post("/addPurchase", addPurchase);
router.post("/editCustomer", editCustomer);
router.post("/editTransaction", editTransaction);
router.delete("/deleteCustomer/:id", deleteCustomer);
router.delete("/clearTransactionsHistory/:id", clearTransactionsHistory);
router.delete("/deleteTransaction/:transactionId/:customerId/:userId", deleteTransaction);

module.exports = router;