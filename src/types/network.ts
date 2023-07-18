interface TokenConfig {
    address: string;
    symbol: string;
    decimals?: number;
    chainId?: bigint | number;
}

export { TokenConfig };
