import "./feed.css";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../axios.config";
import Post from "../post/Post";
import { UserContext } from "../../context/UserContext";

const Feed = ({ profileId }) => {
  const [posts, setPosts] = useState([]);
  const { user, newPost } = useContext(UserContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = profileId
        ? await axiosInstance.get(`/posts/author/${profileId}`)
        : await axiosInstance.get(`/posts/timeline/${user._id}`);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [profileId, user, newPost]);

  return (
    <div className="feedComponent">
      {posts.map((p) => {
        return <Post key={p._id} post={p} />;
      })}
    </div>
  );
};

export default Feed;
