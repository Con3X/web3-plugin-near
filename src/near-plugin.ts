

import { Web3PluginBase } from "web3";

import {
  getErrorTypeFromErrorMessage,
} from '@near-js/utils';
import {
  AccessKeyWithPublicKey,
  BlockId,
  BlockReference,
  BlockResult,
  BlockChangeResult,
  ChangeResult,
  ChunkId,
  ChunkResult,
  EpochValidatorInfo,
  FinalExecutionOutcome,
  GasPrice,
  LightClientProof,
  LightClientProofRequest,
  NextLightClientBlockRequest,
  NextLightClientBlockResponse,
  NearProtocolConfig,
  NodeStatusResult,
  QueryResponseKind,
  TypedError,
  AccountView,
} from '@near-js/types';
import {
    encodeTransaction,
    SignedTransaction,
} from '@near-js/transactions';
import { baseEncode } from "./utils";

/**
 * Near Protocol RPC plugin for web3.js
 * 
 * Note: To provide a good programming experience, lots of code in this file is taken from near-api-js/packages/types/src/provider/response.ts.
 * However, there is a difference between calling those function at near-api-js in this plugin. In this plugin the handling is similar to web3.js.
 */
export class NearPlugin extends Web3PluginBase {
  public pluginNamespace = "near";


  /**
   * Use web3.js request manager to call the JSON RPC specifying the method and params
   *
   * @param method RPC method
   * @param params Parameters to the method
   */
  async sendJsonRpc<T>(method: string, params: object): Promise<T> {
    return this.requestManager.send({
      method,
      params,
    });
  }


    /**
     * Gets the RPC's status
     * @see [https://docs.near.org/docs/develop/front-end/rpc#general-validator-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     */
    async status(): Promise<NodeStatusResult> {
      return this.sendJsonRpc('status', []);
  }

  /**
   * Sends a signed transaction to the RPC and waits until transaction is fully complete
   * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
   *
   * @param signedTransaction The signed transaction being sent
   */
  async sendTransaction(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
      const bytes = encodeTransaction(signedTransaction);
      return this.sendJsonRpc('broadcast_tx_commit', [Buffer.from(bytes).toString('base64')]);
  }

  /**
   * Sends a signed transaction to the RPC and immediately returns transaction hash
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
   * @param signedTransaction The signed transaction being sent
   * @returns {Promise<FinalExecutionOutcome>}
   */
  async sendTransactionAsync(signedTransaction: SignedTransaction): Promise<FinalExecutionOutcome> {
      const bytes = encodeTransaction(signedTransaction);
      return this.sendJsonRpc('broadcast_tx_async', [Buffer.from(bytes).toString('base64')]);
  }

  /**
   * Gets a transaction's status from the RPC
   * @see [https://docs.near.org/docs/develop/front-end/rpc#transaction-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
   *
   * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
   * @param accountId The NEAR account that signed the transaction
   */
  async txStatus(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome> {
      if (typeof txHash === 'string') {
          return this.txStatusString(txHash, accountId);
      } else {
          return this.txStatusUint8Array(txHash, accountId);
      }
  }

  private async txStatusUint8Array(txHash: Uint8Array, accountId: string): Promise<FinalExecutionOutcome> {
      return this.sendJsonRpc('tx', [baseEncode(txHash), accountId]);
  }

  private async txStatusString(txHash: string, accountId: string): Promise<FinalExecutionOutcome> {
      return this.sendJsonRpc('tx', [txHash, accountId]);
  }

  /**
   * Gets a transaction's status from the RPC with receipts
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
   * @param txHash The hash of the transaction
   * @param accountId The NEAR account that signed the transaction
   * @returns {Promise<FinalExecutionOutcome>}
   */
  async txStatusReceipts(txHash: Uint8Array | string, accountId: string): Promise<FinalExecutionOutcome> {
      if (typeof txHash === 'string') {
          return this.sendJsonRpc('EXPERIMENTAL_tx_status', [txHash, accountId]);
      }
      else {
          return this.sendJsonRpc('EXPERIMENTAL_tx_status', [baseEncode(txHash), accountId]);
      }
  }

  /**
   * Query the RPC by passing an {@link providers/provider!RpcQueryRequest}
   * @see [https://docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts)
   *
   * @typeParam T the shape of the returned query response
   */
  async query<T extends QueryResponseKind>(...args: any[]): Promise<T> {
      let result;
      if (args.length === 1) {
          const { block_id, blockId, ...otherParams } = args[0];
          result = await this.sendJsonRpc<T>('query', { ...otherParams, block_id: block_id || blockId });
      } else {
          const [path, data] = args;
          result = await this.sendJsonRpc<T>('query', [path, data]);
      }
      if (result && result.error) {
          throw new TypedError(
              `Querying failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`,
              getErrorTypeFromErrorMessage(result.error, result.error.name)
          );
      }
      return result;
  }



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
  async block(blockQuery: BlockId | BlockReference): Promise<BlockResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('block', { block_id: blockId, finality });
  }

  /**
   * Query changes in block from the RPC
   * pass block_id OR finality as blockQuery, not both
   * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
   */
  async blockChanges(blockQuery: BlockReference): Promise<BlockChangeResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
  }

  /**
   * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
   * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
   *
   * @param chunkId Hash of a chunk ID or shard ID
   */
  async chunk(chunkId: ChunkId): Promise<ChunkResult> {
      return this.sendJsonRpc('chunk', [chunkId]);
  }

  /**
   * Query validators of the epoch defined by the given block id.
   * @see [https://docs.near.org/api/rpc/network#validation-status](https://docs.near.org/api/rpc/network#validation-status)
   *
   * @param blockId Block hash or height, or null for latest.
   */
  async validators(blockId: BlockId | null): Promise<EpochValidatorInfo> {
      return this.sendJsonRpc('validators', [blockId]);
  }

  /**
   * Gets the protocol config at a block from RPC
   *
   * @param blockReference specifies the block to get the protocol config for
   */
  async experimental_protocolConfig(blockReference: BlockReference | { sync_checkpoint: 'genesis' }): Promise<NearProtocolConfig> {
      const { blockId, ...otherParams } = blockReference as any;
      return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { ...otherParams, block_id: blockId });
  }

  /**
   * Gets a light client execution proof for verifying execution outcomes
   * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
   */
  async lightClientProof(request: LightClientProofRequest): Promise<LightClientProof> {
      return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
  }

  /**
   * Returns the next light client block as far in the future as possible from the last known hash
   * to still be able to validate from that hash. This will either return the last block of the
   * next epoch, or the last final known block.
   * 
   * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
   */
  async nextLightClientBlock(request: NextLightClientBlockRequest): Promise<NextLightClientBlockResponse> {
      return await this.sendJsonRpc('next_light_client_block', request);
  }

  /**
   * Gets access key changes for a given array of accountIds
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
   * @returns {Promise<ChangeResult>}
   */
  async accessKeyChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('EXPERIMENTAL_changes', {
          changes_type: 'all_access_key_changes',
          account_ids: accountIdArray,
          block_id: blockId,
          finality
      });
  }

  /**
   * Gets single access key changes for a given array of access keys
   * pass block_id OR finality as blockQuery, not both
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
   * @returns {Promise<ChangeResult>}
   */
  async singleAccessKeyChanges(accessKeyArray: AccessKeyWithPublicKey[], blockQuery: BlockReference): Promise<ChangeResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('EXPERIMENTAL_changes', {
          changes_type: 'single_access_key_changes',
          keys: accessKeyArray,
          block_id: blockId,
          finality
      });
  }

  /**
   * Gets account changes for a given array of accountIds
   * pass block_id OR finality as blockQuery, not both
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
   * @returns {Promise<ChangeResult>}
   */
  async accountChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('EXPERIMENTAL_changes', {
          changes_type: 'account_changes',
          account_ids: accountIdArray,
          block_id: blockId,
          finality
      });
  }

  /**
   * Gets contract state changes for a given array of accountIds
   * pass block_id OR finality as blockQuery, not both
   * Note: If you pass a keyPrefix it must be base64 encoded
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
   * @returns {Promise<ChangeResult>}
   */
  async contractStateChanges(accountIdArray: string[], blockQuery: BlockReference, keyPrefix = ''): Promise<ChangeResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('EXPERIMENTAL_changes', {
        	changes_type: 'data_changes',
        	account_ids: accountIdArray,
        	key_prefix_base64: keyPrefix,
        	block_id: blockId,
        	finality
      });
  }

  /**
   * Gets contract code changes for a given array of accountIds
   * pass block_id OR finality as blockQuery, not both
   * Note: Change is returned in a base64 encoded WASM file
   * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
   * @returns {Promise<ChangeResult>}
   */
  async contractCodeChanges(accountIdArray: string[], blockQuery: BlockReference): Promise<ChangeResult> {
      const { finality } = blockQuery as any;
      const { blockId } = blockQuery as any;
      return this.sendJsonRpc('EXPERIMENTAL_changes', {
          changes_type: 'contract_code_changes',
          account_ids: accountIdArray,
          block_id: blockId,
          finality
      });
  }

  /**
   * Returns gas price for a specific block_height or block_hash.
   * @see [https://docs.near.org/api/rpc/gas](https://docs.near.org/api/rpc/gas)
   *
   * @param blockId Block hash or height, or null for latest.
   */
  async gasPrice(blockId: BlockId | null): Promise<GasPrice> {
      return await this.sendJsonRpc('gas_price', [blockId]);
  }


  // Methods below are aliases for the methods above to follow web3.js naming conventions

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
	 * This is the method alternative to `web3.eth.getProtocolVersion()`.
	 * @returns Returns the near protocol version of the node.

	 * ```ts
	 * web3.near.getProtocolVersion().then(console.log);
	 * > "63"
	 * ```
	 */
	public async getProtocolVersion() {
    	return ((await this.status()) as unknown as { protocol_version: string }).protocol_version; 
	}

	/**
	 * Returns the syncing information of the connected node.
	 * This is the method alternative to `web3.eth.isSyncing()`.
	 *
	 * @returns {@link SyncInfo} if the node is syncing or `false`.
	 *
	 * ```ts
	 * web3.near.isSyncing().then(console.log);
	 * > {
	 *     earliest_block_hash: '8snisqbicmC4JKp9tMTzXH5xwFJCKFxKZMv7uowBVZRA',
	 *     earliest_block_height: 0,
	 *     earliest_block_time: '2022-05-26T17:51:59.259808104Z',
	 *     epoch_id: '9HxhRsYmbabnk1T7ANvKhicggzn5jfm1rVyfEEVDqoFN',
	 *     epoch_start_height: 9501,
	 *     latest_block_hash: 'B775wfpR6zzYWG1HKJs3GNw73ZjodtdBi6XcvzREZu65',
	 *     latest_block_height: 9998,
	 *     latest_block_time: '2023-11-08T09:17:26.990259717Z',
	 *     latest_state_root: '4aDwnhjSqLnsM5JLXHgCx3iehfinTBR5yRBQ5rS8CBv1',
	 *     syncing: true
	 * }
   * 
   * or: 
   * > false
	 * ```
	 */
	public async isSyncing() {
    const syncInfo = (await this.status()).sync_info;

    // this condition is added to simulate the behavior of ethereum node
    // if you do not want this behavior simply use `status().sync_info` method instead.
    if(!syncInfo.syncing) {
      return false;
    }

    return syncInfo; 
	}

	/**
	 * This is the method alternative to `web3.eth.getCoinbase()` but it returns a string array of accounts.
	 * @returns Returns the list of current validators of the connected node.
	 *
	 * ```ts
	 * web3.near.getCoinbase().then(console.log);
	 * > [ 'test.near']
	 * ```
	 */
	public async getCoinbase() : Promise<string[]> {
    const validators = (await this.status()).validators; 
    
    // it seems some nodes return validators as an array of strings and some as an array of objects
    return validators.map(
      v => 
        (v as unknown as {account_id: string}).account_id 
        ? (v as unknown as {account_id: string}).account_id 
        : v);
  }

  /**
   * this method is not compatible with Near Protocol RPC. 
   * However, if you do not think so, please open an issue or a PR at web3-plugin/near repo.
   */
	public async isMining() {
    throw new Error("Method not compatible with Near Protocol RPC. However, if you do not think so, please open an issue or a PR at web3-plugin/near repo.");
	
  }

  /**
   * this method is not compatible with Near Protocol RPC. 
   * However, if you do not think so, please open an issue or a PR at web3-plugin/near repo.
   */
	public async getHashrate() {
    	throw new Error("Method not compatible with Near Protocol RPC. However, if you do not think so, please open an issue or a PR at web3-plugin/near repo.");
	}

	/**
	 * This is the method alternative to `web3.eth.getGasPrice()`.
	 * @returns The gas price determined by the last block as bigint.
	 *
	 * ```ts
	 * web3.eth.getGasPrice().then(console.log);
	 * > 1000000000n
	 * ```
	 */
	public async getGasPrice(): Promise<bigint> {
		return BigInt((await this.gasPrice(null)).gas_price);
	}

	/**
	 * this method is not compatible with Near Protocol RPC. 
	 * However, if you do not think so, please open an issue or a PR at web3-plugin/near repo.
	 */
	public async getAccounts() {
		throw new Error("Method not compatible with Near Protocol RPC. However, if you do not think so, please open an issue or a PR at web3-plugin/near repo.");
	}

	/**
	 * Alias for the `block` method.
	 * This is the method alternative to `web3.eth.getBlockNumber()`.
	 * @returns Promise<number>
	 */
	async getBlockNumber(blockQuery: BlockReference): Promise<number> {
		return (await this.block(blockQuery)).header.height;
	}

	/**
	 * Get the balance of an address at a given block.
	 *
	 * @param accountId The address to get the balance of.
	 * @param blockReference ({@link BlockReference} Specifies what block to use as the current state for the balance query.
	 * @returns The current balance for the given address.
	 *
	 * ```ts
	 * web3.near.getBalance("test.near").then(console.log);
	 * > 1000000000000000000000000000000000n
	 * ```
	 */
	public async getBalance(
		accountId: string,
		blockReference: BlockReference
	) {
		const account = await this.query({
			request_type: "view_account",
			account_id: accountId,
			...blockReference,
		}) as AccountView;	
		return BigInt(account.amount);
	}

	// @TODO: implement the rest of the methods available in web3.eth

}

// Module Augmentation
declare module "web3" {
  interface Web3Context {
    near: NearPlugin;
  }
}
