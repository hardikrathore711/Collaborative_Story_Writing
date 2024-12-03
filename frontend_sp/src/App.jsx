import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StoryPage from "./pages/StoryPage";
import CreateStoryPage from "./pages/CreateStoryPage";
import CreatePartPage from "./pages/CreatePartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story/:storyId" element={<StoryPage />} />
        <Route path="/create" element={<CreateStoryPage />} />
        <Route path="/story/:storyId/add-part" element={<CreatePartPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
