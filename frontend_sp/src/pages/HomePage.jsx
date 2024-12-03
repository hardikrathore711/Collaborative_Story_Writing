import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
        const token = localStorage.getItem("token");  //Retrive token from Local Storage
        console.log('Retrieved Token:', token);
      try {
        const response = await axios.get("http://localhost:3000/api/stories/view",{
            headers: {
                Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
              },
        });
        console.log(response.data);
        setStories(response.data);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, []);

  return (
    <div>
      <h1>All Stories</h1>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <Link to={`/story/${story.id}`}>{story.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
