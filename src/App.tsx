import "./App.css";
import BasicTable from "./components/BasicTable";
import "./App.css";
import LoginSignup from "./components/LoginSignup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* <Header siteTitle="SLACK SSO" /> */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<BasicTable />} />
          <Route path="/sd" element={<h1>Yes</h1>} />
        </Routes>
      </main>
    </Router>
  );
}

const Home = () => {
  return (
    <div>
      <LoginSignup />
    </div>
  );
};


export default App;
