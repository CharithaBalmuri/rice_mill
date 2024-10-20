const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Customers = require('./schema')

const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL).then(
    ()=>console.log("DB Connected....")
).catch(err=>console.log(err));

app.get('/',(req,res)=> { 
res.send("<h1>Hi</h1>");
}
);

// Endpoint to handle registration form submission
app.post('/sign_up', async (req, res) => {
    try {
        const newCustomer = new Customers({
            name: req.body.name,
            age: req.body.age,
            email: req.body.email,
            phno: req.body.phno,
            gender: req.body.gender,
            password: req.body.password,
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).send({ message: "Customer registered successfully", customer: savedCustomer });
    } catch (error) {
        res.status(400).send({ message: "Error registering customer", error: error.message });
    }
});

app.use(express.static('public'));

app.listen(3001, ()=> console.log("Server Running..."));
