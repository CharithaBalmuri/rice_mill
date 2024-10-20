const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const products = require('./products.json');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ricemill', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    phoneNumber: String
}, { collection: 'customers' });
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    discount: Number,
    stock: Number
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from 'public' directory
app.post('/add-product', async (req, res) => {
    try {
        const { name, price, discount, stock } = req.body;
        const product = new Product({
            name,
            price,
            discount,
            stock
        });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Failed to add product.');
    }
});
// Get all products matching a given name
app.get('/products/:name', async (req, res) => {
    try {
        const productName = req.params.name;
        const products = require('./products.json'); // Load products from JSON file
        const product = products.find(p => p.name === productName);
        if (!product) {
            throw new Error('Product not found');
        }
        res.send(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(404).send('Product not found');
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.send(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to fetch products.');
    }
});

// Delete a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.send('Product deleted successfully.');
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).send('Failed to delete product.');
    }
});

app.post('/register', async (req, res) => {
    const { firstName, lastName, username, password, email, phoneNumber } = req.body;
    console.log('Received registration data:', req.body); // Log received data
    if (firstName && lastName && username && password && email && phoneNumber) {
        try {
            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists with this email:', email); // Log existing user
                return res.status(400).json({ success: false, message: 'User already exists with this email' });
            }

            const user = new User({ firstName, lastName, username, password, email, phoneNumber });
            await user.save();
            console.log('User saved successfully:', user); // Log the user data
            res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (error) {
            console.error('Error saving user:', error); // Log error
            res.status(500).json({ success: false, message: 'Error registering user' });
        }
    } else {
        console.warn('Invalid data received:', req.body); // Log invalid data
        res.status(400).json({ success: false, message: 'Invalid data' });
    }
});

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Login attempt:', req.body); // Log login attempt
//     try {
//         const user = await User.findOne({ email, password });
//         if (user) {
//             console.log('Login successful'); // Log success
//             res.json({ success: true });
//         } else {
//             console.log('Invalid email or password'); // Log invalid attempt
//             res.json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         console.error('Error logging in:', error); // Log error
//         res.status(500).json({ success: false, message: 'Error logging in' });
//     }
// });

// app.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     console.log('Login attempt:', req.body); // Log login attempt
//     try {
//         const user = await User.findOne({ email, password });
//         if (user) {
//             console.log('Login successful'); // Log success
//             res.json({ success: true, user: { username: user.username, email: user.email } });
//         } else {
//             console.log('Invalid email or password'); // Log invalid attempt
//             res.json({ success: false, message: 'Invalid email or password' });
//         }
//     } catch (error) {
//         console.error('Error logging in:', error); // Log error
//         res.status(500).json({ success: false, message: 'Error logging in' });
//     }
// });

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body); // Log login attempt
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            console.log('Login successful'); // Log success
            res.json({ success: true, username: user.username });
        } else {
            console.log('Invalid email or password'); // Log invalid attempt
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error); // Log error
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});


// Add this route to check if email exists
app.post('/check-email', async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: 'Error checking email' });
    }
});

app.get('/customers', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error); // Log error
        res.status(500).json({ success: false, message: 'Error fetching users' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});