# wallet-api

A simple wallet API for creating wallets, handling transactions, and retrieving wallet and transaction information.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Implementation Details](#implementation-details)

---

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env` and update `MONGO_URI` and `PORT` as needed.

3. **Run the server:**
   ```
   npm start
   ```

---

## Project Structure

```
.
├── boot/                # App bootstrapping (DB, server)
├── config/              # Configuration files
├── src/
│   ├── controllers/     # Express controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   └── utils/           # Utilities (logger, arithmetic, etc.)
├── index.js             # Entry point
├── package.json
└── README.md
```

---

## API Documentation

| Method | Endpoint                   | Description                        | Request Body / Params                | Success Response Example | Error Response Example |
|--------|----------------------------|------------------------------------|--------------------------------------|-------------------------|-----------------------|
| POST   | `/setup`                   | Create a new wallet                | `{ "name": "Alice", "balance": 100 }`| `{ "id": "100001", "balance": 100, "transactionId": 100001, "name": "Alice", "date": "2025-06-15T12:00:00Z" }` | `{ "error": "..." }` |
| GET    | `/wallet/:id`              | Get wallet details by walletId     | URL param: `id`                      | `{ "id": "...", "walletId": "100001", "balance": 100, "name": "Alice", "date": "2025-06-15T12:00:00Z" }` | `{ "error": "Wallet not found" }` |
| POST   | `/transact/:walletId`      | Credit/Debit a wallet              | URL param: `walletId`, body: `{ "amount": 50, "description": "Deposit" }` | `{ "balance": 150, "transactionId": "100002" }` | `{ "error": "Insufficient balance" }` |
| GET    | `/transactions?walletId=100001&skip=0&limit=10` | List wallet transactions | Query: `walletId`, `skip`, `limit`   | `[ { "id": "...", "walletId": "100001", "amount": 50, "balance": 150, "description": "Deposit", "date": "...", "type": "CREDIT" }, ... ]` | `{ "error": "No transactions found for this wallet" }` |

---

### API Details

#### 1. Create Wallet

- **POST** `/setup`
- **Body:** `{ "name": "Alice", "balance": 100 }`
- **Response:**
  ```json
  {
    "id": "100001",
    "balance": 100,
    "transactionId": 100001,
    "name": "Alice",
    "date": "2025-06-15T12:00:00Z"
  }
  ```

#### 2. Get Wallet

- **GET** `/wallet/:id`
- **Response:**
  ```json
  {
    "id": "...",
    "walletId": "100001",
    "balance": 100,
    "name": "Alice",
    "date": "2025-06-15T12:00:00Z"
  }
  ```

#### 3. Transact (Credit/Debit)

- **POST** `/transact/:walletId`
- **Body:** `{ "amount": 50, "description": "Deposit" }`
- **Response:**
  ```json
  {
    "balance": 150,
    "transactionId": "100002"
  }
  ```

#### 4. Get Transactions

- **GET** `/transactions?walletId=100001&skip=0&limit=10`
- **Response:**
  ```json
  [
    {
      "id": "...",
      "walletId": "100001",
      "amount": 50,
      "balance": 150,
      "description": "Deposit",
      "date": "2025-06-15T12:00:00Z",
      "type": "CREDIT"
    }
  ]
  ```

---

## Implementation Details

- **Tech Stack:** Node.js, Express, MongoDB (Mongoose), Pino logger, BigNumber.js for arithmetic.
- **Models:** `Wallet`, `Transaction`, `Sequence` (for auto-increment IDs).
- **Services:** All business logic is in `src/services/wallet.service.js`.
- **Controllers:** API endpoints are handled in `src/controllers/wallet.controller.js`.
- **Routes:** Defined in `src/routes/wallet.route.js`.
- **Utilities:** Logging, arithmetic, and request logging in `src/utils/`.

---

## Error Handling

All endpoints return errors in the format:
```json
{ "error": "Error message" }
```

---