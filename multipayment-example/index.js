const fetch = require("node-fetch");
const { Transactions, Managers } = require("@arkecosystem/crypto");

// Set height to specific 2.6 milestone to enable V2 transactions in the BuilderFactory
Managers.configManager.setHeight(4006000);

// Set node to interact with
const node = "https://dexplorer.ark.io";

// Your delegate name, used to fetch the nonce
const username = "lemii";

// Your delegate passphrase, used to sign the multipayment transaction
const passphrase =
  "word word word word word word word word word word word word";

// (OPTIONAL) Use a custom nonce. If left empty, the nonce will be fetched using the configured node
const customNonce = null;

// All payments that will be added to the multipayment transaction
const payments = [
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "1" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "2" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "3" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "4" },
  { recipientId: "DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR", amount: "5" }
];

// Main script
const main = async () => {
  let nonce = customNonce
    ? parseInt(customNonce)
    : await fetch(`${node}/api/v2/wallets/${username}`)
        .then(res => res.json())
        .then(json => parseInt(json.data.nonce));

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

const generateMultiPayment = nonce => {
  // The nonce of a transaction must be the wallet's current nonce + 1
  nonce += 1;

  const tx = Transactions.BuilderFactory.multiPayment().nonce(nonce);

  payments.forEach(payment => {
    tx.addPayment(payment.recipientId, payment.amount);
  });

  tx.sign(passphrase);

  return tx.build();
};

const broadcast = async transactions => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json", "API-Version": "2" },
    body: JSON.stringify({ transactions })
  };

  return fetch(`${node}/api/transactions`, options)
    .then(res => res.json())
    .catch(err => err.message);
};

if (typeof module !== "undefined" && !module.parent) main();
