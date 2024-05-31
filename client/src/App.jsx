import { BrowserRouter, Router, Route } from "react-router-dom";
import Posts from "./pages/Posts";
import SignIn from "./pages/SigIn";
import SignUp from "./pages/SignUp";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Router>
        <Route path="/" element={<Posts />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
      </Router>
    </BrowserRouter>
  );
}

export default App;
