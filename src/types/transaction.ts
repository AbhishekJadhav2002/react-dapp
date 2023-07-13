interface Transaction {
    from: String | Number;
    to: String | Number | undefined;
    value: Number | String | BigInt;
    gas?: Number;
    gasPrice?: Number | String | BigInt;
    data?: string;
    nonce?: number;
    chain?: string;
}

export { Transaction };
