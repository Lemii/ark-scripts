const config = {
  // Your delegate name, used to fetch the nonce
  username: "lemii",

  // Your delegate passphrase, used to sign transactions
  passphrase: "word word word word word word word word word word word word",

  // Your delegate passphrase, used to sign transactions
  secondPassphrase: null,

  // (OPTIONAL) Use a custom starting nonce. If left empty, the nonce will be fetched using the configured node
  customNonce: null,

  // Set node to connect to
  node: "https://dexplorer.ark.io"
};

module.exports = config;
