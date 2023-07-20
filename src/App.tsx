import { Web3Modal } from "@web3modal/react";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";
import "./App.scss";
import { Navbar } from "./components";
import { ethereumClient, wagmiClient } from "./configs/web3.configs";
import { Home } from "./pages";

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <Navbar />
      <Home />
      <ToastContainer />

      <Web3Modal
        projectId={process.env.REACT_APP_WEB3_PROJECT_ID as string}
        ethereumClient={ethereumClient}
        themeVariables={{
          "--w3m-accent-color": "#09d3ac",
        }}
      />
    </WagmiConfig>
  );
}

export default App;
