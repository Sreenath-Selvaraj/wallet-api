const logger = require("@logger");
const walletService = new (require("../services/wallet.service"))();

class WalletController {
  async setupWallet(req, res) {
    try {
      const result = await walletService.setupWallet(req.body);
      res.status(200).json(result);
    } catch (err) {
      logger.error(err, `Error setting up wallet`);
      res.status(500).json({ error: err.message });
    }
  }

  async handleTransaction(req, res) {
    try {
      const result = await walletService.handleTransaction(req.params.walletId, req.body);
      res.status(200).json(result);
    } catch (err) {
      logger.error(err, `Error transacting wallet`);
      res.status(500).json({ error: err.message });
    }
  }

  async getTransactions(req, res) {
    try {
      const { walletId, skip = 0, limit = 10 } = req.query;
      const result = await walletService.getTransactions(walletId, skip, limit);
      res.status(200).json(result);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async getWallet(req, res) {
    try {
      const result = await walletService.getWallet(req.params.id);
      res.status(200).json(result);
    } catch (err) {
      logger.error(err);
      res.status(404).json({ error: err.message });
    }
  }
}

module.exports = WalletController;
