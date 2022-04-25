const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const connectDB = async (req, res, next) => {
  try {
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB Connected!');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
