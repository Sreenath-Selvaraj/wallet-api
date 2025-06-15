const sequence = require("@models/sequence.model");

async function getNextSequence(type) {
  const updatedCounter = await sequence.findOneAndUpdate(
    { type },
    { $inc: { sequenceNumber: 1 } },
    { new: true, upsert: true }
  );
  return updatedCounter.sequenceNumber;
}

module.exports = { getNextSequence };
