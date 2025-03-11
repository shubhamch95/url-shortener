const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
require('dotenv').config();
const urlModel = require('./models/URL');
const Blacklist = require('./models/Blacklist');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

// Declare the rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: { error: "Too many requests, please try again later." }
});

//Route to shorten a URL
app.post('/shorten', limiter, async (req, res) => {
  const { originalUrl } = req.body;

  try {
    // Validate URL
    let urlObj;
    try {
      urlObj = new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const urlDomain = urlObj.hostname.toLowerCase();

    // Check if the domain is blacklisted
    const blacklistEntry = await Blacklist.findOne({ domain: urlDomain });
    if (blacklistEntry) {
      return res.status(400).json({ error: 'This URL is blacklisted and cannot be shortened.' });
    }

    // Check if the URL already exists
    const existingUrl = await urlModel.findOne({ originalUrl });
    if (existingUrl) {
      return res.json({ shortUrl: existingUrl.shortUrl });
    }

    // Create a new shortened URL
    const shortUrl = shortid.generate();
    const newUrl = new urlModel({ originalUrl, shortUrl });
    await newUrl.save();

    res.json({ shortUrl });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Route to add a domain to the blacklist
app.post('/blacklist', async (req, res) => {
  const { domain } = req.body;

  try {
    // Validate & extract the hostname
    let urlObj;
    try {
      urlObj = new URL(domain);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    const extractedDomain = urlObj.hostname.toLowerCase();

    // Check if already blacklisted
    const existingEntry = await Blacklist.findOne({ domain: extractedDomain });
    if (existingEntry) {
      return res.status(400).json({ error: 'Domain already blacklisted.' });
    }

    // Save normalized domain
    const newEntry = new Blacklist({ domain: extractedDomain });
    await newEntry.save();
    res.status(201).json({ message: 'Domain added to blacklist.', domain: extractedDomain });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});


// Route to get all blacklisted domains
app.get('/blacklist', async (req, res) => {
  try {
    const blacklistedDomains = await Blacklist.find({});
    res.json(blacklistedDomains);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Redirect using shortened URL
app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  const url = await urlModel.findOne({ shortUrl });
  if (!url) {
    return res.status(404).json({ error: 'URL not found' });
  }

  url.visitCount += 1;
  url.visitHistory.push(new Date());
  await url.save();

  res.redirect(url.originalUrl);
});

// Get analytics for a shortened URL
app.get('/analytics/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  const url = await urlModel.findOne({ shortUrl });
  if (!url) {
    return res.status(404).json({ error: 'URL not found' });
  }

  res.json({
    originalUrl: url.originalUrl,
    shortUrl: url.shortUrl,
    visitCount: url.visitCount,
    visitHistory: url.visitHistory
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
