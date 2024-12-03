import React, { useState } from "react";
import axios from "axios";

const CreateStoryPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Retrieve token from local storage

      if (!token) {
        setMessage("You need to log in first!");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/stories/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      setMessage("Story created successfully!");
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error creating story");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Story</h2>
      <input
        type="text"
        name="title"
        placeholder="Story Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="content"
        placeholder="Write your story here..."
        value={formData.content}
        onChange={handleChange}
        required
      />
      <button type="submit">Create Story</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateStoryPage;
