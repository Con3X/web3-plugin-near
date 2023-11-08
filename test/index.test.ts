import { Web3 } from "web3";
import { NearPlugin } from "../src";

// endpoint URL varies by network:
//  mainnet https://rpc.mainnet.near.org
//  testnet https://rpc.testnet.near.org
//  betanet https://rpc.betanet.near.org (may be unstable)
//  localnet http://localhost:3030 (or http://127.0.0.1:8332)
// Querying Historical Data
//  mainnet https://archival-rpc.mainnet.near.org
//  testnet https://archival-rpc.testnet.near.org

describe("NearPlugin Tests", () => {

  describe("NearPlugin method tests", () => {

    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("http://127.0.0.1:8332");
      web3.registerPlugin(new NearPlugin());
    });

    afterAll(() => {
    });

    it("should call `getBlockNumber` method with expected param", async () => {
      const result = await web3.near.getBlockNumber({ blockId: 0 });
      expect(typeof result).toBe("number");
      expect(result).toBe(0);
      // console.log(result);
    });

    it("should call `block` method with expected param", async () => {

      const result = await web3.near.getBlock({ finality: "final" });
      expect(result).toBeDefined();
      expect(result.author).toBeDefined();
      expect(result.header).toBeDefined();
      expect(result.chunks).toBeDefined();

      expect(result.header.height).toBeGreaterThanOrEqual(0);

      // console.log(result);
    });
    
    it("should call `getProtocolVersion`", async () => {

      const result = await web3.near.getProtocolVersion();
      expect(result).toBeGreaterThanOrEqual(57);

      // console.log(result);
    });

    
    it("should call `isSyncing`", async () => {

      const result = await web3.near.isSyncing();
      expect(result).toBeDefined();

      // console.log(result);
    });

    it("should call `getGasPrice`", async () => {

      const result = await web3.near.getGasPrice();
      expect(result).toBeDefined();

      // console.log(result);
    });

    it("should call `getCoinbase`", async () => {

      const result = await web3.near.getCoinbase();
      expect(result).toBeDefined();

      // console.log(result);
    });

    it("should call `getCoinbase`", async () => {

      const result = await web3.near.getBalance('test.near', { blockId: 0 });
      expect(result).toBeGreaterThanOrEqual(0);

      // console.log(result);
    });
    
  });
});
