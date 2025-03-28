import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./Pages/SignUp";
import Signin from "./Pages/SignIn";
import Dashboard from "./Pages/Dashboard";
import SendMoney from "./Pages/SendMoney";

function App() {
  return (
    <BrowserRouter>
     
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<SendMoney />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
