const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;
const { exit } = require("../utils");
const { Transactions, Managers } = require("@arkecosystem/crypto");

// Set height to specific 2.6 milestone to enable V2 transactions in the BuilderFactory
Managers.configManager.setHeight(4006000);
const limit = Managers.configManager.getMilestone().multiPaymentLimit;

const main = () => {
  // Parse argument values
  const { passphrase, secondPassphrase, nonce, format } = argv;

  let payments;
  try {
    payments = JSON.parse(argv.payments);
  } catch {
    exit("Invalid payments argument");
  }

  if (!passphrase || !nonce || !payments) {
    exit("Not enough and/or invalid arguments");
  }

  if (payments.length > limit) {
    exit(`Number of payments exceed maximum of ${limit}.`);
  }

  if (![undefined, "file", "console"].includes(format)) {
    exit(`Invalid format format: ${format}`);
  }

  // Build multipayment transaction
  const tx = Transactions.BuilderFactory.multiPayment().nonce(nonce);

  payments.forEach(payment => {
    tx.addPayment(payment.recipientId, payment.amount);
  });

  tx.sign(passphrase);

  if (secondPassphrase) {
    tx.secondSign(secondPassphrase);
  }

  // Build and convert transaction object to JSON
  const txJson = JSON.stringify(tx.build().toJson());

  if (format === "file" || format === undefined) {
    fs.writeFileSync(path.resolve(__dirname, "tx.json"), txJson);
  } else {
    console.log(txJson);
  }
};

if (typeof module !== "undefined" && !module.parent) main();
