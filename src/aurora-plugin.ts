import {  Web3Eth } from "web3";


// type AuroraAPI = {
//     // @TODO list the RPC methods that are not listed in EthExecutionAPI
// }

/**
 * Aurora Engine plugin for web3.js
 * It would implement the RPC methods listed at https://doc.aurora.dev/evm/rpc
 * This would be an alternative to using https://github.com/aurora-is-near/aurora.js and a replacement for the deprecated https://github.com/aurora-is-near/near-web3-provider
 * @remarks This is a work in progress. Only a few methods are implemented so far.
*/
export class AuroraPlugin //extends Web3PluginBase<AuroraAPI & EthExecutionAPI> 
    extends Web3Eth {
    
    public pluginNamespace = "aurora";

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
     * implementation of `parity_pendingTransactions` RPC method
     */
    async parityPendingTransactions(): Promise<any> {
        return this.sendJsonRpc("parity_pendingTransactions", []);
    }

    /**
     * implementation of `txpool_status` RPC method
     */
    async txpoolStatus(): Promise<any> {
        return this.sendJsonRpc("txpool_status", []);
    }

    /**
     * implementation of `txpool_inspect` RPC method
     */
    async txpoolInspect(): Promise<any> {
        return this.sendJsonRpc("txpool_inspect", []);
    }

    /**
     * implementation of `txpool_content` RPC method
     */
    async txpoolContent(): Promise<any> {
        return this.sendJsonRpc("txpool_content", []);
    }
}


// Module Augmentation
declare module "web3" {
    interface Web3Context {
        aurora: AuroraPlugin;
    }
  }
  