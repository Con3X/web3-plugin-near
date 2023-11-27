import { Web3 } from 'web3';
import { NearPlugin } from '../src';

// endpoint URL varies by network:
//  mainnet https://rpc.mainnet.near.org
//  testnet https://rpc.testnet.near.org
//  betanet https://rpc.betanet.near.org (may be unstable)
//  localnet http://localhost:3030 (or http://127.0.0.1:8332)
// Querying Historical Data
//  mainnet https://archival-rpc.mainnet.near.org
//  testnet https://archival-rpc.testnet.near.org

describe('NearPlugin Tests', () => {
	describe('NearPlugin method tests', () => {
		let web3: Web3;
		let web3OnTestNet: Web3;

		beforeAll(() => {
			web3 = new Web3('http://127.0.0.1:8332');
			web3.registerPlugin(new NearPlugin());

			web3OnTestNet = new Web3('https://rpc.testnet.near.org');
			web3OnTestNet.registerPlugin(new NearPlugin());
		});

		afterAll(() => {});

		it('should call `getBlockNumber` method with expected param', async () => {
			const result = await web3.near.getBlockNumber({ blockId: 0 });
			expect(typeof result).toBe('number');
			expect(result).toBe(0);

			// console.log(result);
		});

		it('should call `block` method with expected param', async () => {
			const result = await web3.near.getBlock({ finality: 'final' });
			expect(result).toBeDefined();
			expect(result.author).toBeDefined();
			expect(result.header).toBeDefined();
			expect(result.chunks).toBeDefined();

			expect(result.header.height).toBeGreaterThanOrEqual(0);

			// consider checking more on the result

			// console.log(result);
		});

		it('should call `getProtocolVersion`', async () => {
			const result = await web3.near.getProtocolVersion();
			expect(result).toBeGreaterThanOrEqual(57);

			// console.log(result);
		});

		it('should call `isSyncing`', async () => {
			const result = await web3.near.isSyncing();
			expect(result).toBeDefined();

			// consider checking more on the result

			// console.log(result);
		});

		it('should call `getGasPrice`', async () => {
			const result = await web3.near.getGasPrice();
			expect(result).toBeDefined();

			// consider checking more on the result

			// console.log(result);
		});

		it('should call `getCoinbase`', async () => {
			const result = await web3.near.getCoinbase();
			expect(result).toBeDefined();

			// consider checking more on the result

			// console.log(result);
		});

		it('should call `getBalance`', async () => {
			const result = await web3.near.getBalance('test.near', { blockId: 0 });
			expect(result).toBeGreaterThanOrEqual(0);
		});

		it('should call `getCode` ', async () => {
			const result = await web3OnTestNet.near.getCode('guest-book.testnet', { finality: 'final' });
			expect(result).toMatch(/AGFzbQEAAAABXxFgAX8Bf2ACf38Bf2ACf38AYAN.*?/);
		});

		it('should throw when calling `getCode` on a non-contract account to ', async () => {
			const res = web3.near.getCode('test.near', { finality: 'final' });
			await expect(res).rejects.toMatchObject({
				innerError: {
					cause: {
						name: 'NO_CONTRACT_CODE',
					},
					code: -32000,
					message: 'Server error',
					data: 'Contract code for contract ID #test.near has never been observed on the node',
				},
			});
		});
	});
});