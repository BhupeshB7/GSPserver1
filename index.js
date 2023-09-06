const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const passwordRoute = require('./routes/passwordReset');
const register = require('./routes/register');
const fileUpload = require("express-fileupload");
// Connect to MongoDB database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Connected to MongoDB'))
    
    .catch((error) => console.error(error));
  // Middleware
  app.use(cors({
    // origin:"http://localhost:3000"
    // origin:"https://globalsuccesspoint.netlify.app"
    // origin:"https://globalsuccesspoint.in"
  }));
  app.use(express.json());
  app.use(fileUpload())
// error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
// Routes
app.use("/api/auth", require("./routes/auth"));

//for User Register
app.use('/api/users', register);
//for password Reset
app.use('/api/auth', passwordRoute);
app.use('/api/users', require('./routes/users'));
//Admin Routes
app.use("/api/admin", require('./routes/Admin/admin'));
//contact
app.use('/api', require('./routes/contact'));
   // Admin 
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error');
  });
  
  // 
  
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  