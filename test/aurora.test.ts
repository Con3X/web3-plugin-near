import { Web3 } from "web3";
import { AuroraPlugin } from "../src";

// Endpoints for Aurora
// Mainnet
//  HTTPS
//    The Mainnet Web3 endpoint is at: https://mainnet.aurora.dev (port 443)
//  WSS
//    The Mainnet Websocket endpoint is at: wss://mainnet.aurora.dev
// Testnet
//  HTTPS
//    The Testnet Web3 endpoint is at: https://testnet.aurora.dev (port 443)
//   WSS
//    The Testnet Websocket endpoint is at: wss://testnet.aurora.dev

describe("AuroraPlugin Tests", () => {

  let web3: Web3;

  beforeAll(() => {
    web3 = new Web3("https://mainnet.aurora.dev");
    web3.registerPlugin(new AuroraPlugin(web3.provider));
  });

  afterAll(() => {
  });

  describe("AuroraPlugin can call Ethereum standard RPC endpoints", () => {


    it("should call `getBlockNumber` method with expected param", async () => {
      const result = await web3.aurora.getBlockNumber();
      expect(typeof result).toBe("bigint");

      // console.log(result);
    });

    it("should call `block` method with expected param", async () => {

      const result = await web3.aurora.getBlock();
      expect(result).toBeDefined();
      expect(result.gasLimit).toBeDefined();

      // consider checking more on the result

      // console.log(result);
    });
    
    it("should call `getProtocolVersion`", async () => {

      const result = await web3.aurora.getProtocolVersion();
      expect(typeof result).toBe('string');

      // console.log(result);
    });

    
    it("should call `isSyncing`", async () => {

      const result = await web3.aurora.isSyncing();
      expect(result).toBeDefined();

      // consider checking more on the result

      // console.log(result);
    });

    it("should call `getGasPrice`", async () => {

      const result = await web3.aurora.getGasPrice();
      expect(result).toBeDefined();

      // consider checking more on the result

      // console.log(result);
    });

    it("should call `getCoinbase`", async () => {

      const result = await web3.aurora.getCoinbase();
      expect(result).toBeDefined();

      // consider checking more on the result
      
      // console.log(result);
    });

    it("should call `getCoinbase`", async () => {

      const result = await web3.aurora.getBalance('0x0000000000000000000000000000000000000000');
      expect(result).toBeGreaterThanOrEqual(0);

      // consider checking more on the result

      // console.log(result);
    });
  });


    describe("AuroraPlugin can call the additional Aurora endpoints", () => {

      it("should call `parityPendingTransactions`", async () => {

        const result = await web3.aurora.parityPendingTransactions();
        expect(typeof result).toBe('object');
        expect(typeof result.length).toBe('number');
  
        // consider checking more on the result
  
        // console.log(result);
      });

    // The following seems to not be yet implemented in the current version running the main net and test net. 
    //  However, it is marked as completed at:  https://doc.aurora.dev/evm/rpc
    it.skip("should call `txpoolStatus`", async () => {

      const result = await web3.aurora.txpoolStatus();
      expect(typeof result).toBe('object');

      // consider checking more on the result

      // console.log(result);
    });

    // The following seems to not be yet implemented in the current version running the main net and test net. 
    //  However, it is marked as completed at:  https://doc.aurora.dev/evm/rpc
    it.skip("should call `txpoolInspect`", async () => {

      const result = await web3.aurora.txpoolInspect();
      expect(typeof result).toBe('object');

      // consider checking more on the result

      // console.log(result);
    });

    // The following seems to not be yet implemented in the current version running the main net and test net. 
    //  However, it is marked as completed at:  https://doc.aurora.dev/evm/rpc
    it.skip("should call `txpoolContent`", async () => {

      const result = await web3.aurora.txpoolContent();
      expect(typeof result).toBe('object');

      // consider checking more on the result

      // console.log(result);
    });
    
    
  });
});
