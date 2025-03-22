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
    const { customerId, amount, forPeople } = req.body;
    try {
        if (!customerId || !amount ) throw Error("All fields must be filled!");

        const customer = await Customer.findById(customerId);
        if (!customer) throw Error("Customer not found");

        customer.transactions.push({
            type: "purchase",
            amount,
            for: forPeople || ""
        });

        customer.total += amount;
        await customer.save();

        res.status(200).json({ message: "Purchase added successfully", balance: customer.balance });
    } catch (error) {
        res.status(500).json({ message: "Failed to add purchase", error: error.message });
    }
};

// hey lamma hada ydfa3
const addPayment = async (req, res) => {
    const { customerId, amount, forPeople } = req.body;
    try {
        if (!customerId || !amount) throw Error("All fields must be filled!");

        const customer = await Customer.findById(customerId);
        if (!customer) throw Error("Customer not found");

        customer.transactions.push({
            type: "payment",
            amount,
            for: forPeople || ""
        });

        customer.total -= amount;
        await customer.save();

        res.status(200).json({ message: "Payment recorded successfully", balance: customer.balance });
    } catch (error) {
        res.status(500).json({ message: "Failed to record payment", error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        if(!id)throw Error("No id passed as parameter");
        const resultat = await Customer.findByIdAndDelete({ _id:id });
        if (!resultat) throw Error("An error occured");
        const users =await User.find({});
        res.status(200).json({ message: "Customer deleted successfully", users});
    } catch (error) {
        res.status(500).json({ message: "An error occured during deleting the customer", error: error.message })
    }
}

module.exports = { addCustomer, getCustomersByUser, addPurchase, addPayment, deleteCustomer };
