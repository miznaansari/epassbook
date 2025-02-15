const mongoose = require('mongoose');

const connectDB = async () => {
 
//mongodb+srv://miznaansari:2sAc7wuwKHHzfnoh@mizna.jfncd.mongodb.net/Epassbook?retryWrites=true&w=majority&appName=Mizna
  try {
    await mongoose.connect('mongodb://localhost:27017/epassbook', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


//2sAc7wuwKHHzfnoh