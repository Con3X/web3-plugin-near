web3.js plugin for Near Protocol
===========
This is a PoC project for web3.js plugin for Near Protocol.

It currently implements only `block` its alias `getBlock`, and `getBlockNumber`.


Plugin usage by users
------------
At your typescript project first run:
`yarn add web3 @conx3/web3-plugin-near`

And here is how to use the plugin:
```ts
import { Web3 } from 'web3';
import { NearPlugin } from '@conx3/web3-plugin-near';

async function main() {
  const web3 web3 = new Web3("https://rpc.mainnet.near.org");
  web3.registerPlugin(new NearPlugin());
  
  const blockNumber = await web3.near.getBlockNumber({ finality: "final" });
  console.log('blockNumber', blockNumber);

  const block = await web3.near.getBlock({ blockId: "7nsuuitwS7xcdGnD9JgrE22cRB2vf2VS4yh1N9S71F4d" });
  console.log('block', block);
}

main();
```

Creating a Local Development Environment
------------

Follow: https://docs.near.org/develop/testing/kurtosis-localnet

[If this is you second time, just double check running `~/launch-local-near-cluster.sh` and ensure docker containers are running]

Contributing
------------

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
