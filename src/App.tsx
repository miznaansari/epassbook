
import './App.css'
import Login from './components/Login'
import SectionA from './components/SectionA'
import SectionB from './components/SectionB'
import SectionC from './components/SectionC'
import Signup from './components/Signup'
import AuthState from './context/AuthState'

function App() {

  return (
    <>
    <AuthState >
    <Signup />

    </AuthState>
    {/* <Login /> */}
      {/* <SectionA />
     <SectionB />
     <SectionC />  */}
     
    </>
  )
}

export default App
