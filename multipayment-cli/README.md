# ARK Multipayment CLI

A simple CLI script intended to help in the automation of generating a multipayment transactions. 

Saves the transaction as a JSON file or log the JSON output to the console. 

The following arguments must be provided:

`--passphrase` Your mnemonic passphrase  
`--secondPassphrase` (optional) Your second mnemonic passphrase  
`--nonce` Your current nonce + 1  
`--payments` A JSON array with all payments  
`--format` The output format, can be either `file` or `console`. If left empty, defaults to `file`.

Example command:
```
node index \
--nonce 70711 \
--passphrase "word word word word word word word word word word word word" \
--format console \
--payments '[{"amount":"1","recipientId":"DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR"},{"amount":"1","recipientId":"DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR"},{"amount":"1","recipientId":"DAWNRvnMNPWodLjQwhphJwUpTW2KJXBzVR"}]' 

```