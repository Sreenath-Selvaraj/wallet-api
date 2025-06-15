const WalletModel = require("../models/wallet.model");
const TransactionModel = require("../models/transaction.model");
const { getNextSequence } = require("../utils/sequence");
const { roundOff, plus } = require("@arithmetic");
const state = require("@boot/db").get();
const { TRANSACTION_TYPES } = require("../constants/transaction.constant");
const { SEQUENCE_TYPES } = require("../constants/sequenceType.constants");
class WalletService {
  /**
   * Creates a new wallet and an initial transaction.
   * @param {Object} params - Wallet creation parameters.
   * @param {number} [params.balance=0] - Initial balance for the wallet.
   * @param {string} params.name - Name of the wallet owner.
   * @returns {Promise<Object>} Wallet details including id, balance, transactionId, name, and date.
   */
  async setupWallet({ balance = 0, name }) {
    let wallet, transaction, walletId, transactionId;

    await state.connection.transaction(async () => {
      balance = roundOff(balance);
      walletId = await getNextSequence(SEQUENCE_TYPES.WALLET);
      transactionId = await getNextSequence(SEQUENCE_TYPES.TRANSACTION);

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
        type: TRANSACTION_TYPES.CREDIT,
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

  /**
   * Handles a credit or debit transaction for a wallet.
   * @param {string|number} walletId - The wallet's unique identifier.
   * @param {Object} params - Transaction parameters.
   * @param {number} params.amount - Amount to credit (positive) or debit (negative).
   * @param {string} params.description - Description of the transaction.
   * @returns {Promise<Object>} Updated balance and transactionId.
   * @throws {Error} If wallet not found or insufficient balance.
   */
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

      transactionId = await getNextSequence(SEQUENCE_TYPES.TRANSACTION);

      await TransactionModel.create({
        transactionId,
        walletId: wallet._id,
        amount: txnAmount,
        balance: newBalance,
        description,
        type: txnAmount > 0 ? TRANSACTION_TYPES.CREDIT : TRANSACTION_TYPES.DEBIT,
      });

      await wallet.save();
    });

    return {
      balance: roundOff(newBalance),
      transactionId: transactionId.toString(),
    };
  }

  /**
   * Retrieves a paginated list of transactions for a wallet.
   * @param {string|number} walletId - The wallet's unique identifier.
   * @param {number} [skip=0] - Number of transactions to skip (for pagination).
   * @param {number} [limit=10] - Maximum number of transactions to return.
   * @returns {Promise<Array<Object>>} List of transaction objects.
   * @throws {Error} If no transactions found for the wallet.
   */
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
      id: txn.transactionId.toString(),
      walletId: walletId.toString(),
      amount: roundOff(txn.amount),
      balance: roundOff(txn.balance),
      description: txn.description,
      date: txn.date,
      type: txn.type,
    }));
  }

  /**
   * Retrieves wallet details by walletId.
   * @param {string|number} id - The wallet's unique identifier.
   * @returns {Promise<Object>} Wallet details.
   * @throws {Error} If wallet not found.
   */
  async getWallet(id) {
    const wallet = await WalletModel.findOne({ walletId: parseInt(id) });
    if (!wallet) throw new Error("Wallet not found");

    return {
      id: wallet.walletId.toString(),
      balance: roundOff(wallet.balance),
      name: wallet.name,
      date: wallet.date,
    };
  }
}

module.exports = WalletService;
