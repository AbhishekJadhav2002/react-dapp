import { BrowserProvider } from "ethers";
import Web3 from "web3";

type Providers = "ethers" | "web3"

interface Account {
    address?: string;
    chainId?: bigint;
    balance?: bigint;
}

interface Connection {
    provider: Web3 | BrowserProvider | undefined,
    connect: () => Promise<string | Error | undefined>;
    disconnect: () => void;
    isConnected: boolean;
    account?: Account | undefined;
    error?: Error | undefined;
    setLibrary: (library: Providers) => void;
    switchChain: (chainId: bigint) => Promise<BigInt | Error | undefined>;
}

export { Account, Connection, Providers };
