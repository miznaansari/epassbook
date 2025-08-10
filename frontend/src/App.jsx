import { Route, Routes } from "react-router";
import ViewTxn from "./components/home/ViewTxn";
import Home from "./components/Home";
import AuthPage from "./components/Auth/Login";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
