import bs58 from 'bs58';

// @TODO: use `baseEncode` from `@near/utils` once the next version is released (>0.0.4).

/**
 * Encodes a Uint8Array or string into base58
 * @param value Uint8Array or string representing a borsh encoded object
 * @returns string base58 encoding of the value
 */
export function baseEncode(value: Uint8Array | string): string {
	if (typeof value === 'string') {
		const bytes = new Uint8Array(value.length);
		for (let c = 0; c < value.length; c++) {
			bytes[c] = value.charCodeAt(c);
		}
		value = bytes;
	}
	return bs58.encode(value);
}

/**
 * Decodes a base58 string into a Uint8Array
 * @param value base58 encoded string
 * @returns Uint8Array representing the decoded value
 */
export function baseDecode(value: string): Uint8Array {
	return new Uint8Array(bs58.decode(value));
}
