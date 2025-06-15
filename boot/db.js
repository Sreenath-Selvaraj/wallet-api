const mongoose = require("mongoose");
const logger = require("@logger");

var state = {
  db: null,
};

exports.connect = async () => {
  if (state.db) {
    return;
  }
  state.db = await mongoose.connect(process.env.MONGO_URI);
  mongoose.set('transactionAsyncLocalStorage', true);

  logger.info("MongoDB connected");
};

exports.close = async () => {
  if (state.db) {
    await mongoose.connection.close();
    state.db = null;
    logger.info("MongoDB connection closed");
  }
};

exports.get = () => {
  if (!state.db) {
    throw new Error("Database not connected");
  }
  return state.db;
}
