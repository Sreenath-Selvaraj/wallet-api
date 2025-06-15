const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    unique: true 
  },
  sequenceNumber: { 
    type: Number, 
    default: 100000 
  },
});

module.exports = mongoose.model("sequence", schema);
