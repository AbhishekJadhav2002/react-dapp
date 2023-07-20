import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createClient } from 'wagmi';
import { bscTestnet, sepolia } from 'wagmi/chains';

const chains = [sepolia, bscTestnet]
const projectId = process.env.REACT_APP_WEB3_PROJECT_ID as string

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
export const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);