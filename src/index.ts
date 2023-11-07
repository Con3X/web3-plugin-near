import { BlockId, BlockReference, BlockResult, Finality } from "@near-js/types";
import { Web3PluginBase } from "web3";

declare type NearAPI = { 
  block: (blockQuery: BlockReference) => Promise<BlockResult>;
}

export class NearPlugin extends Web3PluginBase<NearAPI> {
  public pluginNamespace = "near";

  /**
   * Query for block info from the RPC
   * pass block_id OR finality as blockQuery, not both
   * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
   *
   * @param blockQuery {@link https://docs.near.org/tools/near-api-js/reference/modules/providers_provider#blockreference} (passing a {@link https://docs.near.org/tools/near-api-js/reference/modules/providers_provider#blockid} is deprecated)
   * @example
   * ```typescript
   * const result = await web3.near.block({ blockId: 123456 });
   * console.log(result);
   * ```
   * @example
   * ```typescript
    * const result = await web3.near.block({ blockId: "123456" });
    * console.log(result);
    * ```
    * @example
    * ```typescript
    * const result = await web3.near.block({ finality: "final" });
    * console.log(result);
    * ``` 
  */
  async block(blockQuery: BlockReference): Promise<BlockResult> {
    const { finality } = (blockQuery as {
      finality: Finality;
    });
      const block_id = (blockQuery as {
        blockId: BlockId;
    }).blockId;

    return this.requestManager.send({
      // plugin has access to web3.js internal features like request manager
      method: 'block',
      params: { block_id, finality },
    });
  }

  /**
   * Alias for the `block` method.
   * This is the method alternative to `web3.eth.getBlock()`.
   * @param blockQuery {@link https://docs.near.org/tools/near-api-js/reference/modules/providers_provider#blockreference} (passing a {@link https://docs.near.org/tools/near-api-js/reference/modules/providers_provider#blockid} is deprecated)
   * @returns Promise<BlockResult>
   */
  async getBlock(blockQuery: BlockReference): Promise<BlockResult> {
    return this.block(blockQuery);
  }

  /**
   * Alias for the `block` method.
   * This is the method alternative to `web3.eth.getBlockNumber()`.
   * @returns Promise<number>
   */
  async getBlockNumber(blockQuery: BlockReference): Promise<number> {
    return (await this.block(blockQuery)).header.height;
  }
}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    near: NearPlugin;
  }
}
