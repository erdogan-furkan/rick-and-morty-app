import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Home from "./pages/Home";
import CharacterDetail from "./pages/CharacterDetail";
import "./App.css";

function App() {
  return (
    <Box className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
      </Routes>
    </Box>
  );
}

export default App;
