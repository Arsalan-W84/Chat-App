import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./Pages/Landing";
import { Dashboard } from "./Pages/Dashboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element = {< Landing />} ></Route>
                <Route path="/dashboard" element ={< Dashboard />} ></Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App