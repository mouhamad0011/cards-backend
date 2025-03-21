const mongoose = require('mongoose');
const DatabaseUrl = process.env.MONGO_URI;

 async function checkConnection() {
   try {
     await mongoose.connect(DatabaseUrl);
     console.log('Connected to database successfully');
   } catch (error) {
     console.log("Failed to connect",error);
   }
  }

module.exports = {checkConnection};