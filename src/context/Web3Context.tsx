import { FC, createContext, useContext } from "react";
import useEthersWalletConnect from "../hooks/useWalletConnect";
import { Connection, Props } from "../types";

const Web3Context = createContext<Connection | null>(null);

const Web3ContextProvider: FC<Props> = ({ children }) => {
  const connection = useEthersWalletConnect("ethers");

  return (
    <Web3Context.Provider value={connection}>{children}</Web3Context.Provider>
  );
};

export default Web3ContextProvider;

export const useWeb3Context = () => useContext(Web3Context);
