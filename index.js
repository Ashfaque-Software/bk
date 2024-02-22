// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema
const dataSchema = new mongoose.Schema({
  text: String,
});

const Data = mongoose.model('Data', dataSchema);

// Routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/data', async (req, res) => {
  const { text } = req.body;
  try {
    const newData = new Data({ text });
    await newData.save();
    res.status(201).json(newData);
  } catch (error) {
    console.error('Error adding data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.delete('/api/data/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Data.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
