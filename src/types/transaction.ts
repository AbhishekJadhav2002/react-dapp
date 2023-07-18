interface Transaction {
    from: String | Number;
    to: string;
    value: string;
    gas?: Number;
    gasPrice?: Number | String | BigInt;
    data?: string;
    nonce?: number;
    chain?: string;
}

export { Transaction };
