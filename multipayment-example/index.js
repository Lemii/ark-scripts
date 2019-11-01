const { broadcast, getNonce } = require("../utils");
const { Transactions, Managers } = require("@arkecosystem/crypto");

const { passphrase, secondPassphrase } = require("../config");

// Set height to specific 2.6 milestone to enable V2 transactions in the BuilderFactory
Managers.configManager.setHeight(4006000);

// All payments that will be added to the multipayment transaction
const payments = [
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "1" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "2" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "3" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "4" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "5" }
];

const generateMultiPayment = nonce => {
  // The nonce of a transaction must be the wallet's current nonce + 1
  nonce += 1;

  const tx = Transactions.BuilderFactory.multiPayment().nonce(nonce);

  payments.forEach(payment => {
    tx.addPayment(payment.recipientId, payment.amount);
  });

  tx.sign(passphrase);

  if (secondPassphrase) {
    tx.secondSign(secondPassphrase);
  }

  return tx.build();
};

// Main script
const main = async () => {
  let nonce = await getNonce();

  const transactions = [];

  const tx = generateMultiPayment(nonce);

  transactions.push(tx.toJson());

  const res = await broadcast(transactions).catch(err => console.log(err));

  console.log(res);

  if (res.errors) {
    const errorKeys = Object.keys(res.errors);
    errorKeys.forEach(key => {
      console.log(res.errors[key]);
    });
  }
};

if (typeof module !== "undefined" && !module.parent) main();
