const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;
const bip39 = require("bip39");
const { exit } = require("../utils");
const { Identities } = require("@arkecosystem/crypto");

const createAccount = () => {
  const passphrase = bip39.generateMnemonic();
  const address = Identities.Address.fromPassphrase(passphrase);
  const keys = Identities.Keys.fromPassphrase(passphrase);

  return { address, passphrase, keys };
};

const main = () => {
  const { amount } = argv;
  const numOfAccounts = amount ? amount : 10;

  const accounts = [];

  for (let i = 0; i < numOfAccounts; i++) {
    const account = createAccount();
    accounts.push(account);
    console.log(account);
  }

  fs.writeFile(path.resolve(__dirname, "accounts.json"), JSON.stringify(accounts, null, 2), err => {
    if (err) {
      exit("Could not save file");
    } else {
      console.log(`Successfully saved ${numOfAccounts} accounts to 'accounts.json'`);
    }
  });
};

if (typeof module !== "undefined" && !module.parent) main();
