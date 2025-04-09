const Customer = require("../models/customers");

// Hon aam zid zboun jdid
const addCustomer = async (req, res) => {
    const { userId, name, phone } = req.body;
    try {
        if (!userId || !name || !phone) throw Error("All fields must be filled!");
        
        const customer = await Customer.create({ 
            userId, 
            name, 
            phone, 
            total: 0, 
            transactions: [] 
        });

        res.status(200).json({ message: "Customer added successfully", customer });
    } catch (error) {
        res.status(500).json({ message: "Failed to add customer", error: error.message });
    }
};

// Hey krml jib zbounet la hada maayan
const getCustomersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) throw Error("User ID is required");

        const customers = await Customer.find({ userId });
        res.status(200).json({ message: "Customers retrieved successfully", customers });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve customers", error: error.message });
    }
};

// hey lamma hada yshtere
const addPurchase = async (req, res) => {
    const { customerId, amount, forPeople, description, userId  } = req.body;
    try {
        if (!customerId || !amount ) throw Error("All fields must be filled!");

        const customer = await Customer.findById(customerId);
        if (!customer) throw Error("Customer not found");

        customer.transactions.push({
            type: "purchase",
            amount,
            for: forPeople || "",
            description: description || ""
        });

        customer.total = Number(customer.total) + Number(amount);
        await customer.save();
        const customers = await Customer.find({ userId });
        res.status(200).json({ message: "Purchase added successfully", customers });
    } catch (error) {
        res.status(500).json({ message: "Failed to add purchase", error: error.message });
    }
};

// hey lamma hada ydfa3
const addPayment = async (req, res) => {
    const { customerId, amount, forPeople, description, userId } = req.body;
    try {
        if (!customerId || !amount) throw Error("All fields must be filled!");

        const customer = await Customer.findById(customerId);
        if (!customer) throw Error("Customer not found");

        customer.transactions.push({
            type: "payment",
            amount,
            for: forPeople || "",
            description: description || ""
        });

        customer.total = Number(customer.total) - Number(amount);
        await customer.save();
        const customers = await Customer.find({ userId });
        res.status(200).json({ message: "Payment recorded successfully", customers });
    } catch (error) {
        res.status(500).json({ message: "Failed to record payment", error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        if(!id)throw Error("No id passed as parameter");
        const resultat = await Customer.findByIdAndDelete({ _id:id });
        const userId = resultat.userId;
        if (!resultat) throw Error("An error occured");
        const customers =await Customer.find({userId});
        res.status(200).json({ message: "Customer deleted successfully", customers});
    } catch (error) {
        res.status(500).json({ message: "An error occured during deleting the customer", error: error.message })
    }
}

const editCustomer = async (req, res) => {
    const { customerId, name, phone } = req.body;
    try {
        if (!customerId) throw Error("Customer ID is required");

        const customer = await Customer.findById(customerId);
        if (!customer) throw Error("Customer not found");
        if (name) customer.name = name;
        if (phone) customer.phone = phone;

        await customer.save();

        res.status(200).json({ message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(500).json({ message: "Failed to update customer", error: error.message });
    }
};

const clearTransactionsHistory = async (req, res) => {
    const { id } = req.params;
    try {
        if(!id)throw Error("No id passed as parameter");
        const resultat = await Customer.findById({ _id:id });
        if (!resultat) throw Error("An error occured");
        const userId = resultat.userId;
        resultat.transactions = [];
        await resultat.save();
        const customers =await Customer.find({userId});
        res.status(200).json({ message: "Transactions history cleared successfully", customers});
    } catch (error) {
        res.status(500).json({ message: "An error occured during clearing transactions history", error: error.message })
    }
}

const editTransaction = async (req, res) => {
    const { customerId, transactionId, amount, forPeople, description, userId } = req.body;

    try {
        if (!customerId || !transactionId || !amount) throw Error("All fields must be filled!");

        const customer = await Customer.findById(customerId);
        if (!customer) throw Error("Customer not found");

        const transaction = customer.transactions.id(transactionId);
        if (!transaction) throw Error("Transaction not found");
        if (transaction.type === "purchase") {
            customer.total = Number(customer.total) - Number(transaction.amount) + Number(amount);
        } else if (transaction.type === "payment") {
            customer.total = Number(customer.total) + Number(transaction.amount) - Number(amount);
        }

        transaction.amount = amount;
        transaction.for = forPeople || "";
        transaction.description = description || "";

        await customer.save();
        const customers = await Customer.find({ userId });
        res.status(200).json({ message: "Transaction edited successfully", customers });
    } catch (error) {
        res.status(500).json({ message: "Failed to edit transaction", error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
      const { transactionId, customerId, userId } = req.params;
  
      const customer = await Customer.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      const transactionIndex = customer.transactions.findIndex(
        (t) => t._id.toString() === transactionId
      );
      if (transactionIndex === -1) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      customer.transactions.splice(transactionIndex, 1);
      await customer.save();
      const customers = await Customer.find({ userId });
      res.status(200).json({
        message: "Transaction deleted successfully",
        customers,
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Error deleting transaction",
        error: error.message,
      });
    }
  };
module.exports = { addCustomer, getCustomersByUser, addPurchase, addPayment, deleteCustomer, editCustomer, clearTransactionsHistory, editTransaction, deleteTransaction };
