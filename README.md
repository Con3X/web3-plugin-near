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
import { NearPlugin, AuroraPlugin } from '@conx3/web3-plugin-near';

async function near() {
  const web3 = new Web3('https://archival-rpc.mainnet.near.org');
  web3.registerPlugin(new NearPlugin());

  const blockNumber = await web3.near.getBlockNumber({ finality: 'final' });
  console.log('near blockNumber', blockNumber);

  const block = await web3.near.getBlock({
    blockId: 'EgG4dp1j1doy8kMaTx7j715nn9K7QXGByi8QUyRdSned',
  });
  console.log('near block', block);

  // Hint: you can try to give a blockId that does not exist in order to see the error returned by web3.js
  // try {
  //   const invalidBlock = await web3.near.getBlock({
  //     blockId: 'xyz',
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
}

near();

async function aurora() {
  const web3 = new Web3('https://mainnet.aurora.dev');
  web3.registerPlugin(new AuroraPlugin(web3.provider));

  const blockNumber = await web3.aurora.getBlockNumber();
  console.log('aurora blockNumber', blockNumber);

  const parityPendingTransactions =
    await web3.aurora.parityPendingTransactions();
  console.log('aurora parityPendingTransactions', parityPendingTransactions);
}

aurora();
```

You can play with the npm package online at: https://codesandbox.io/p/sandbox/broken-haze-9krygq?file=%2Findex.js

Project progress:
------------

### NEAR Plugin

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/100?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Create NEAR Plugin and publish it to the `npm` registry

The web3.js plugin for NEAR has been publish to  
https://www.npmjs.com/package/@conx3/web3-plugin-near and it is useable inside this example playground: https://codesandbox.io/p/sandbox/broken-haze-9krygq?file=%2Findex.js Additionally, some tests has been written to test some of the functionality.


![](https://us-central1-progress-markdown.cloudfunctions.net/progress/100?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Implement all basic NEAR RPC methods 

However, there is a difference between calling those function at near-api-js and in this plugin. In this plugin, the internal handling is similar to web3.js. So the provider errors could be caught in the same way the developer would catch with web3.js.

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/30?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Implement alternative methods to ethereum RPC methods available currently at `web3.eth.[RPC_METHOD]`

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600) Implement `web3.near.accounts` that act a bit similar to `web3.eth.accounts`

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/0?dangerColor=800000&warningColor=ff9900&successColor=006600) Implement `web3.near.Contract` that act a bit similar to `web3.eth.Contract`

### NEAR Aurora Plugin

Aurora is a very interesting EVM that would play a nice role in the NEAR ecosystem. And, more web3.js plugins for NEAR ecosystem would be implemented also in the future.

Aurora is an EVM-compatible blockchain built as a smart contract atop NEAR blockchain. This plugin would leverage Aurora custom RPC methods (https://doc.aurora.dev/evm/rpc/) and other custom behavior enabled at Aurora especially Cross-Contract Calls (XCC). More on Aurora XCC at https://github.com/aurora-is-near/aurora-contracts-sdk.

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/100?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Create NEAR Aurora Plugin and publish it to the `npm` registry

The web3.js plugin for NEAR Aurora has been publish to  
https://www.npmjs.com/package/@conx3/web3-plugin-near and it is useable inside this example playground: https://codesandbox.io/p/sandbox/broken-haze-9krygq?file=%2Findex.js. Additionally, some tests has been written to test some of the basic functionality. 

![](https://us-central1-progress-markdown.cloudfunctions.net/progress/50?dangerColor=ccee00&warningColor=eeff00&successColor=006600) `web3.aurora` is also accessible as `web3.near.aurora`

Aurora plugin could be used now as `web3.near.aurora`.
However, its registration needs a bit of simplification. A PR would be opened later on web3.js registry for this and similar use cases.


![](https://us-central1-progress-markdown.cloudfunctions.net/progress/90?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Enable all Ethereum RPC methods on `AuroraPlugin`

Now all Ethereum RPC methods are callable on `web3.aurora` (and on `web3.near.aurora` as a consequence). However, there is a small modification needed to not expose the unsupported methods on `web3.aurora` and the `AuroraPlugin` class.


![](https://us-central1-progress-markdown.cloudfunctions.net/progress/10?dangerColor=ccee00&warningColor=eeff00&successColor=006600) Support custom RPC methods on `AuroraPlugin` (the non-basic-Ethereum)

Some of the custom RPC endpoints available at Aurora Engine are now callable on `AuroraPlugin` as an example of this functionality. However, some of them seems to not be yet implemented in the current version running the main net and test net. Even though, they is marked as completed at:  https://doc.aurora.dev/evm/rpc. So, this need to be double checked.
    

Running Tests
--------------

### Testing NearPlugin

Executing `yarn test near.test.ts` would give something like:

```bash
 PASS  test/index.test.ts
  NearPlugin Tests
    NearPlugin method tests
      ✓ should call `getBlockNumber` method with expected param (10 ms)
      ✓ should call `block` method with expected param (3 ms)
      ✓ should call `getProtocolVersion` (3 ms)
      ✓ should call `isSyncing` (2 ms)
      ✓ should call `getGasPrice` (2 ms)
      ✓ should call `getCoinbase` (2 ms)
      ✓ should call `getCoinbase` (2 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        1.685 s, estimated 2 s
Ran all test suites.
Done in 2.16s.
```

Note: Before running the tests, be sure to run NEAR development node before. You can follow: https://docs.near.org/develop/testing/kurtosis-localnet. And if this is not your first time following the steps for running a development node, just double check the values when running `~/launch-local-near-cluster.sh` and ensure docker containers are running]


### Testing AuroraPlugin

Executing `yarn test aurora.test.ts` would give something like:
```bash

 PASS  test/aurora.test.ts
  AuroraPlugin Tests
    AuroraPlugin can call Ethereum standard RPC endpoints
      ✓ should call `getBlockNumber` method with expected param (429 ms)
      ✓ should call `block` method with expected param (189 ms)
      ✓ should call `getProtocolVersion` (198 ms)
      ✓ should call `isSyncing` (194 ms)
      ✓ should call `getGasPrice` (196 ms)
      ✓ should call `getCoinbase` (129 ms)
      ✓ should call `getCoinbase` (153 ms)
    AuroraPlugin can call the additional Aurora endpoints
      ✓ should call `parityPendingTransactions` (195 ms)
      ○ skipped should call `txpoolStatus`
      ○ skipped should call `txpoolInspect`
      ○ skipped should call `txpoolContent`

Test Suites: 1 passed, 1 total
Tests:       3 skipped, 8 passed, 11 total
Snapshots:   0 total
Time:        3.969 s, estimated 4 s
Ran all test suites matching /aurora.test.ts/i.
Done in 4.42s.
```


Executing `yarn test aurora.test.ts` would give something like:
```bash
 PASS  test/near.aurora.test.ts
  AuroraPlugin Tests
    ✓ should have `web3.near.aurora` setup (1 ms)
    ✓ should call `getBlockNumber` method on `web3.near.aurora` (395 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        2.658 s, estimated 3 s
Ran all test suites matching /near.aurora.test/i.
Done in 3.19s.
```

Contributing
------------

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
