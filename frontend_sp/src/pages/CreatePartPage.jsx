import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreatePartPage = () => {
  const { storyId } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previousPartId, setPreviousPartId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/stories/${storyId}/add-part`,
        {
          title,
          content,
          previousPartId,
        }
      );
      console.log(response.data);
      // Redirect or show success message
    } catch (error) {
      console.error("Error creating part:", error);
    }
  };

  return (
    <div>
      <h1>Create a New Part</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Part Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Part Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Previous Part ID (optional)"
          value={previousPartId}
          onChange={(e) => setPreviousPartId(e.target.value)}
        />
        <button type="submit">Create Part</button>
      </form>
    </div>
  );
};

export default CreatePartPage;
