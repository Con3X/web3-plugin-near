import { Web3 } from "web3";
import { NearPlugin } from "../src";

// endpoint URL varies by network:
//  mainnet https://rpc.mainnet.near.org
//  testnet https://rpc.testnet.near.org
//  betanet https://rpc.betanet.near.org (may be unstable)
//  localnet http://localhost:3030
// Querying Historical Data
//  mainnet https://archival-rpc.mainnet.near.org
//  testnet https://archival-rpc.testnet.near.org

describe("NearPlugin Tests", () => {

  describe("NearPlugin method tests", () => {

    let web3: Web3;

    beforeAll(() => {
      web3 = new Web3("https://rpc.mainnet.near.org");
      web3.registerPlugin(new NearPlugin());
    });

    afterAll(() => {
    });

    it("should call `getBlockNumber` method with expected param", async () => {
      const result = await web3.near.getBlockNumber({ blockId: "7nsuuitwS7xcdGnD9JgrE22cRB2vf2VS4yh1N9S71F4d" });
      expect(typeof result).toBe("number");
      expect(result).toBeGreaterThan(0);
      // console.log(result);
    });
    
    // skip this test to prevent rate limit
    it.skip("should call `block` method with expected param", async () => {

      const result = await web3.near.block({ finality: "final" });
      expect(result).toBeDefined();
      expect(result.author).toBeDefined();
      expect(result.header).toBeDefined();
      expect(result.chunks).toBeDefined();

      // console.log(result);
    });
    
  });
});
