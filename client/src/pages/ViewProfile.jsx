import React from "react";
import { useSearchParams } from "react-router-dom";
import { iconSrcList } from "../utils/icons";

export const ViewProfile = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");
  const [user, setUser] = React.useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  async function fetchUser() {
    try {
      const response = await fetch(
        BASE_URL+`api/public/viewuser?username=${username}`
      );
      const data = await response.json();
      console.log(data);
      setUser(data);
    } catch (error) {
      console.log(error.message);
    }
  }

  React.useEffect(() => {
    fetchUser();
  }, []);
  // http://localhost:3000/viewprofile?username=%22bluepanda69%22

  return (
    <div className="mx-10 mt-[11vh]">
      <div className="w-1/2 flex">
        <img
          src={user?.avtar?.length > 15 ? user.avtar : iconSrcList[user?.avtar]}
          alt={user.username}
          className="w-12 rounded-full object-cover mx-3"
        />
        <h2>Username: {user.username}</h2>
        <div>
          <h2>Followers: {user ? user?.followers?.length : 0}</h2>
          <h2>Following: {user ? user?.following?.length : 0}</h2>
        </div>
      </div>
      <div>
        <h2>Snippets</h2>
        <div>
          {user.publicSnippets?.map((snippet) => (
            <div key={snippet._id}>
              <h3>{snippet.title}</h3>
              <p>{snippet.description}</p>
            </div>
          ))}
        </div>
        <div>
          <h2>Posts</h2>
          {user.publicPosts?.map((post) => (
            <div key={post._id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
