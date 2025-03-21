# URL Shortener

A simple **URL Shortener** built with **Node.js**, **Express**, and **MongoDB**. This application allows users to shorten URLs, track visits, and manage a blacklist of domains.

## Features
- **Shorten URLs** and generate a unique short link.
- **Redirect to original URL** using the short link.
- **Track analytics** (visit count and history) for each shortened URL.
- **Blacklist certain domains** to prevent them from being shortened.
- **Rate limiting** to prevent spam.

---

## Installation

### **1. Clone the repository**
```sh
git clone https://github.com/shubhamch95/url-shortener.git
cd url-shortener
```

### **2. Install dependencies**
```sh
npm install
```

### **3. Configure Environment Variables**
Create a `.env` file in the root directory and add:
```env
MONGO_URI=mongodb://localhost:27017/url-shortener
PORT=3000
```

### **4. Start the Server**
```sh
npm start
```
Server runs on **http://localhost:3000**

---

## API Endpoints

### **1. Shorten a URL**
**POST /shorten**
```json
{
  "originalUrl": "https://example.com"
}
```
**Response:**
```json
{
  "shortUrl": "abc123"
}
```

### **2. Redirect using Shortened URL**
**GET /:shortUrl**
- Redirects to the original URL.

### **3. Get Analytics for a URL**
**GET /analytics/:shortUrl**
**Response:**
```json
{
  "originalUrl": "https://example.com",
  "shortUrl": "abc123",
  "visitCount": 5,
  "visitHistory": ["2024-03-21T10:00:00Z"]
}
```

### **4. Add a Domain to the Blacklist**
**POST /blacklist**
```json
{
  "domain": "https://malicious.com"
}
```
**Response:**
```json
{
  "message": "Domain added to blacklist.",
  "domain": "malicious.com"
}
```

### **5. Get Blacklisted Domains**
**GET /blacklist**
**Response:**
```json
[
  { "domain": "malicious.com", "createdAt": "2024-03-21T10:00:00Z" }
]
```

---

## Folder Structure
```
url-shortener/
│── models/
│   ├── Blacklist.js   # Schema for blacklisted domains
│   ├── URL.js         # Schema for shortened URLs
│── server.js          # Main server file
│── .env               # Environment variables
│── .gitignore         # Ignored files (node_modules, .env)
│── package.json       # Project dependencies
│── README.md          # Project documentation
```

---

## Technologies Used
- **Node.js** - Backend runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **shortid** - Generate unique short URLs
- **dotenv** - Manage environment variables
- **express-rate-limit** - Prevent abuse

---

## License
This project is licensed under the **MIT License**.

---

## Author
**Shubham Chaudhary**
- GitHub: [shubhamch95](https://github.com/shubhamch95)

Feel free to contribute or report issues!

🚀 Happy Coding!
