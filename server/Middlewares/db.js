const mongoose = require("mongoose");

const url = process.env.MONGO_DB_URI;

const mongoDbConnection = async () => {
  try {
    await mongoose.connect(url, {
      dbName: "my_blog_web_app"
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log(`MongoDb  is Connected successfully`);
  } catch (error) {
    console.error("the Connection to MongoDB has failed ".red);
    process.exit(1);
  }
};

module.exports = mongoDbConnection;
