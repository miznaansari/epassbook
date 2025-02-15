import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Login from './components/Login';
import SectionA from './components/SectionA';
import SectionB from './components/SectionB';
import SectionC from './components/SectionC';
import Signup from './components/Signup';
import AuthState from './context/AuthState';
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthState>
      <Router>
        <Navbar />  {/* Moved inside Router */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<MainSections />} />
        </Routes>
      </Router>
    </AuthState>
  );
}

// Separate component to group sections
const MainSections = () => {
  return (
    <>
      <SectionA />
      <SectionB />
      <SectionC />
    </>
  );
};

export default App;
