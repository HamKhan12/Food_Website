// Load dependencies
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./db/connection'); // Database connection
require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const session = require('express-session');

// Create express application
const app = express();

// Middleware
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.use(express.static('public')); // Serve static files
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(morgan('combined')); // Logging middleware
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true })); // Session middleware

// MongoDB Schemas and Models
// Define the Item Schema and Model
const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
});

const Item = mongoose.model('items', ItemSchema);

// Define the User Schema and Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginTime: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
connectDB(); // Establish the MongoDB connection

// Routes
app.get('/', (req, res) => res.render('project_homepage', { title: 'Homepage' }));
app.get('/about', (req, res) => res.render('about', { title: 'About Us' }));
app.get('/review', (req, res) => res.render('review', { title: 'Reviews' }));
app.get('/login', (req, res) => res.render('login', { title: 'Login' }));
app.get('/menu', (req, res) => res.render('menu', { title: 'Menu' }));
app.get('/gallery', (req, res) => res.render('gallery', { title: 'Gallery' }));
app.get('/cart', (req, res) => res.render('cart', { title: 'CART' }));
app.get('/checkout', (req, res) => res.render('checkout', { title: 'CHECKOUT' }));

// Add Routes for Items
const itemRoutes = require('./routes/itemsRoutes');
app.use('/items', itemRoutes);

// Fetch all items from the database
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch items
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items', details: err.message });
  }
});

// POST: Add a new item to the database
app.post('/add-item', async (req, res) => {
  const { name, price, stock } = req.body;

  if (!name || !price || stock === undefined) {
    return res.status(400).json({ error: 'Name, price, and stock are required' });
  }

  try {
    const newItem = new Item({ name, price, stock });
    await newItem.save();
    res.status(201).json({ message: 'Item added successfully', item: newItem });
  } catch (err) {
    console.error('Error adding item: ', err);
    res.status(500).json({ error: 'Error adding item', details: err.message });
  }
});

// POST: Add to Cart
app.post('/add-to-cart', async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId || !quantity) {
    return res.status(400).json({ error: 'Item ID and quantity are required' });
  }

  try {
    // Convert itemId to ObjectId
    const objectId = new mongoose.Types.ObjectId(itemId);

    const item = await Item.findById(objectId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (item.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock available' });
    }

    // Update stock
    item.stock -= quantity;
    await item.save();

    res.status(200).json({
      message: 'Item successfully added to cart',
      item: { id: item._id, name: item.name, remainingStock: item.stock },
    });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({ error: 'Error adding to cart', details: err.message });
  }
});
app.post('/place-order', async (req, res) => {
  const { items } = req.body; // Ensure you send `items` in the request body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty or invalid.' });
  }

  try {
    for (const item of items) {
      const product = await Item.findById(item.itemId);
      if (!product) {
        return res.status(404).json({ error: `Item not found: ${item.itemId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for item: ${product.name}` });
      }

      product.stock -= item.quantity; // Deduct stock
      await product.save(); // Save updated stock
    }

    res.status(200).json({ message: 'Order placed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Error placing order', details: err.message });
  }
});

// POST: Login route
app.post('/auth/login', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ username, email, password });
      await user.save();
    }

    req.session.user = user;
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Error logging in user', details: err.message });
  }
});

// Other Routes
app.post('/submit', (req, res) => {
  res.send('Form Submitted');
});

app.get('/user/:id', (req, res) => {
  res.send('User id is ' + req.params.id);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
