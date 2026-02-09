import Home from "./pages/Home.jsx"
import Actors from "./pages/Actors.jsx"
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/actors" element={<Actors/>}/>
      </Routes>
    </div>
  );
};
export default App;