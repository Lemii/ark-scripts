# ARK Accounts Scripts

Two simple scripts to create and fund a set of random accounts.

### Create accounts

Create random accounts and save as `accounts.json` with:  

```
node ./create-accounts.js
```

Default number of accounts created is `10`. Can be customized by passing arguments to the script:  

```
node ./create-accounts.js --amount 100
```

### Fund accounts  
Fund all the accounts generated in the `accounts.json` file with:

```
node ./fund-accounts.js
```

`amount` funded sent to each accounts defaults to 1 _arktoshi_.  Can be customized by passing arguments to the script:  

```
node ./fund-accounts.js --amount 100000000
```

Funds will be used from the passphrase that is entered in the project's `config.js` file.