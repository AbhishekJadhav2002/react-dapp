interface Account {
    address?: string;
    chainId?: bigint;
    balance?: bigint;
}

interface Connection {
    connect: () => Promise<string | Error>;
    disconnect: () => void;
    isConnected: boolean;
    account?: Account | undefined;
    error?: Error | undefined;
}

export { Account, Connection };
