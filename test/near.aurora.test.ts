import { Web3 } from "web3";
import { AuroraPlugin, NearPlugin } from "../src";

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

describe("web3.near.aurora Tests", () => {

  let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("https://mainnet.aurora.dev");

      // @TODO: the way to register the plugins should be further simplified
      const nearPlugin = new NearPlugin(web3.provider);
      nearPlugin.registerPlugin(new AuroraPlugin(web3.provider));
      web3.registerPlugin(nearPlugin);
    });

    afterAll(() => {
    });

    it("should have `web3.near.aurora` setup", async () => {
      expect(web3.near.aurora).toBeDefined();
    });

    it("should call `getBlockNumber` method on `web3.near.aurora`", async () => {
      const result = await web3.near.aurora.getBlockNumber();
      expect(typeof result).toBe("bigint");

      // console.log(result);
    });

    
});
