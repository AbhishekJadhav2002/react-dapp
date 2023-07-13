import { ToastContainer } from "react-toastify";
import "./App.scss";
import { Navbar } from "./components";
import { Home } from "./pages";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <ToastContainer />
    </>
  );
}

export default App;
