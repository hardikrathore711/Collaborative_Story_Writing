import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StoryPage = () => {
  const { storyId } = useParams();
  const [story, setStory] = useState(null);
  // const [comments, setComments] = useState([]);
  // const [part, setPart] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {

    const fetchStoryDetails = async () => {
      try {
        
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        
        // Config for headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token
          },
        };
        const storyResponse = await axios.get(
          `${apiUrl}/api/stories/story/${storyId}`,
          config
        );
        console.log("Story Response:", storyResponse.data.story);
        setStory(storyResponse.data.story);

        // const commentsResponse = await axios.get(
        //   `${apiUrl}/comments/${storyId}`,
        //   config
        // );
        // setComments(commentsResponse.data);

        // const partResponse = await axios.get(
        //   `${apiUrl}/parts/${storyId}`,
        //   config
        // );
        // setPart(partResponse.data);
      } catch (error) {
        console.error("Error fetching story details:", error);
      }
    };
    fetchStoryDetails();
  }, [storyId]);

  return (
    <div>
      {story && <h1>{story.title}</h1>}
      {story && <div>{story.content}</div>}

      <h2>Comments</h2>
      {/* <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default StoryPage;
