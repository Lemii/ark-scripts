const fetch = require("node-fetch");

const { username, node, customNonce } = require("./config");

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

const fetchRemoteNonce = () =>
  fetch(`${node}/api/v2/wallets/${username}`)
    .then(res => res.json())
    .then(json => parseInt(json.data.nonce));

const getNonce = () => {
  if (customNonce) {
    return customNonce;
  } else {
    return fetchRemoteNonce();
  }
};

const exit = err => {
  console.error(err);
  process.exit(1);
};

const chunk = (array, size = 40) => {
  const chunked_arr = [];
  let index = 0;
  while (index < array.length) {
    chunked_arr.push(array.slice(index, size + index));
    index += size;
  }
  return chunked_arr;
};

const loadAccounts = () => {
  try {
    const accounts = require("./accounts/accounts.json");
    return accounts;
  } catch {
    exit("Could not load accounts");
  }
};

module.exports = { broadcast, getNonce, exit, chunk, loadAccounts };
