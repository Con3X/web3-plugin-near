web3.js plugin for NEAR Protocol
===========

This is an npm package containing a web3.js plugin for NEAR Protocol.

Plugin usage by users
------------
At your typescript project first run:
`yarn add web3 @conx3/web3-plugin-near`

And here is how to use the plugin:
```ts
import { Web3 } from 'web3';
import { NearPlugin } from '@conx3/web3-plugin-near';

async function main() {
  const web3 = new Web3('https://archival-rpc.mainnet.near.org');
  web3.registerPlugin(new NearPlugin());

  const blockNumber = await web3.near.getBlockNumber({ finality: 'final' });
  console.log('blockNumber', blockNumber);

  const block = await web3.near.getBlock({
    blockId: 'EgG4dp1j1doy8kMaTx7j715nn9K7QXGByi8QUyRdSned',
  });
  console.log('block', block);

  // Hint: you can try to give a blockId that does not exist in order to see the error returned by web3.js
  // try {
  //   const invalidBlock = await web3.near.getBlock({
  //     blockId: 'xyz',
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
}

main();
```

You can play with the npm package online at: https://codesandbox.io/p/sandbox/broken-haze-9krygq?file=%2Findex.js

Project progress:
------------

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/100?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Implement all basic NEAR RPC methods 

However, there is a difference between calling those function at near-api-js and in this plugin. In this plugin, the internal handling is similar to web3.js. So the provider errors could be caught in the same way the developer would catch with web3.js.

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/30?dangerColor=ccee00&warningColor=eeff00&successColor=006600) implement few alternative methods to web3.eth

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600) implement web3.near.accounts

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600) implement web3.near.AuraContract
Aurora is an EVM-compatible blockchain built as a smart contract atop NEAR blockchain. This plugin will enable instatiating Aurora Contracts as TypeScript objects and then deploying and interacting with them. More on Aurora Contracts at https://github.com/aurora-is-near/aurora-contracts-sdk

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600) implement web3.near.Contract

Creating a Local Development Environment
------------

Follow: https://docs.near.org/develop/testing/kurtosis-localnet

[If this is you second time, just double check running `~/launch-local-near-cluster.sh` and ensure docker containers are running]

Contributing
------------

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
