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

```

You can play with the npm package online at: https://codesandbox.io/p/sandbox/broken-haze-9krygq?file=%2Findex.js

Project progress
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

There is a web3.js plugin for the Aurora Engine that is an EVM running atop NEAR Protocol. You can check its repository at: https://github.com/conx3/web3-plugin-aurora

Running Tests
--------------

### Testing NearPlugin

Executing `yarn test` would give something like:

```bash
 PASS  test/near-plugin.test.ts
  NearPlugin Tests
    NearPlugin method tests
      ✓ should call `getBlockNumber` method with expected param (10 ms)
      ✓ should call `block` method with expected param (3 ms)
      ✓ should call `getProtocolVersion` (3 ms)
      ✓ should call `isSyncing` (2 ms)
      ✓ should call `getGasPrice` (2 ms)
      ✓ should call `getCoinbase` (2 ms)
      ✓ should call `getBalance` (2 ms)
      ...

Test Suites: 1 passed, 1 total
Tests:       xx passed, xx total
Snapshots:   0 total
Time:        1.685 s, estimated 2 s
Ran all test suites.
Done in 2.16s.
```

Note: Before running the tests, be sure to run NEAR development node before. You can follow: https://docs.near.org/develop/testing/kurtosis-localnet. And if this is not your first time following the steps for running a development node, just double check the values when running `~/launch-local-near-cluster.sh` and ensure docker containers are running]



Contributing
------------

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
