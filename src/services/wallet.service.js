const WalletModel = require("../models/wallet.model");
const TransactionModel = require("../models/transaction.model");
const { getNextSequence } = require("../utils/sequence");
const { roundOff, plus } = require("@arithmetic");
const state = require("@boot/db").get();

class WalletService {
  async setupWallet({ balance = 0, name }) {
    let wallet, transaction, walletId, transactionId;

    await state.connection.transaction(async () => {
      balance = roundOff(balance);
      walletId = await getNextSequence("wallet");
      transactionId = await getNextSequence("transaction");

      wallet = await WalletModel.create({
        walletId,
        name,
        balance: balance,
      });

      transaction = await TransactionModel.create({
        transactionId,
        walletId: wallet._id,
        balance: balance,
        amount: balance,
        description: "Initial Wallet Creation",
        type: "CREDIT",
      });
    });

    return {
      id: walletId.toString(),
      balance: roundOff(wallet.balance),
      transactionId: transactionId,
      name: wallet.name,
      date: wallet.date,
    };
  }

  async handleTransaction(walletId, { amount, description }) {
    let transactionId, newBalance;

    await state.connection.transaction(async () => {
      const wallet = await WalletModel.findOne({  walletId: parseInt(walletId) });
      if (!wallet) throw new Error("Wallet not found");

      const currentBalance = roundOff(wallet.balance);
      const txnAmount = roundOff(amount);
      newBalance = plus(currentBalance, txnAmount);

      if (newBalance < 0) {
        throw new Error("Insufficient balance");
      }

      wallet.balance = newBalance;

      transactionId = await getNextSequence("transaction");

      await TransactionModel.create({
        transactionId,
        walletId: wallet._id,
        amount: txnAmount,
        balance: newBalance,
        description,
        type: txnAmount > 0 ? "CREDIT" : "DEBIT",
      });

      await wallet.save();
    });

    return {
      balance: roundOff(newBalance),
      transactionId: transactionId.toString(),
    };
  }

  async getTransactions(walletId, skip = 0, limit = 10) {
    const wallet = await WalletModel.findOne({  walletId: parseInt(walletId) });
    const transaction = await TransactionModel.find({ walletId: wallet._id })
      .sort({ date: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .lean()
      .exec();
    if (!transaction || transaction.length === 0) {
      throw new Error("No transactions found for this wallet");
    }
    return transaction.map((txn) => ({
      id: txn._id,
      walletId: txn.walletId.toString(),
      amount: roundOff(txn.amount),
      balance: roundOff(txn.balance),
      description: txn.description,
      date: txn.date,
      type: txn.type,
    }));
  }

  async getWallet(id) {
    const wallet = await WalletModel.findOne({ walletId: parseInt(id) });
    if (!wallet) throw new Error("Wallet not found");

    return {
      id: wallet._id,
      walletId: wallet.walletId.toString(),
      balance: roundOff(wallet.balance),
      name: wallet.name,
      date: wallet.date,
    };
  }
}

module.exports = WalletService;
