require('dotenv').config();
const connection = require('./config/connection');
const express=require('express');
const app=express();
const cors=require('cors');
const corsOptions = {
    origin: "https://cards-nhsf.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  };
  
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const userRoutes = require('./routes/users');
app.use('/users', userRoutes);
const customerRoutes = require('./routes/customers');
app.use('/customers', customerRoutes);


app.listen(process.env.PORT,()=>{
    connection.checkConnection();
    console.log(`server is running on port:${process.env.PORT}`)
})