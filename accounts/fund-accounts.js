const argv = require("yargs").argv;
const { getNonce, broadcast, chunk, loadAccounts } = require("../utils");
const { Transactions, Managers } = require("@arkecosystem/crypto");
const { passphrase, secondPassphrase } = require("../config");

// Accounts to fund
const accounts = loadAccounts();

// Set height to specific 2.6 milestone to enable V2 transactions in the BuilderFactory
Managers.configManager.setHeight(4006000);

const main = async () => {
  // Amount of Arktoshis to send to each account
  const { amount } = argv;
  const amountToFund = amount ? amount : "1";

  let nonce = await getNonce();

  const txBatches = [];

  const accountBatches = chunk(accounts);

  for (let accountBatch of accountBatches) {
    const transactions = [];

    for (let account of accountBatch) {
      nonce += 1;

      const tx = Transactions.BuilderFactory.transfer()
        .recipientId(account.address)
        .amount(amountToFund)
        .nonce(nonce);

      tx.sign(passphrase);

      if (secondPassphrase) {
        tx.secondSign(secondPassphrase);
      }

      const txJson = tx.build().toJson();
      transactions.push(txJson);
    }

    txBatches.push(transactions);
  }

  for (let txBatch of txBatches) {
    const res = await broadcast(txBatch);
    console.log(JSON.stringify(res, null, 2));
  }
};

if (typeof module !== "undefined" && !module.parent) main();
