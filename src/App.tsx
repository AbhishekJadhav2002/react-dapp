import { ToastContainer } from "react-toastify";
import "./App.scss";
import { Navbar } from "./components";
import Web3ContextProvider from "./context/Web3Context";
import { Home } from "./pages";

function App() {
  return (
    <Web3ContextProvider>
      <Navbar />
      <Home />
      <ToastContainer />
    </Web3ContextProvider>
  );
}

export default App;
