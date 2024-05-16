import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, db } from "../utils/firebase";
import { doc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import "./profile.css";
import { FaUser, FaWindowClose } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { iconSrcList } from "../utils/icons";
export const Profile = () => {
  const [userdocref, setuserdocref] = useState(null);
  const [value, dataloading, dataerror] = useDocument(userdocref);
  const [userobj, setuserobj] = useState(null);
  const [user, loading, error] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [followerspopup, setfollowerspopup] = useState(false);
  const [followingpopup, setfollowingpopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) setuserdocref(doc(db, "users", user.uid));
  }, [user, loading]);

  useEffect(() => {
    if (user && !dataloading && value) {
      setuserobj(value.data());
      console.log(iconSrcList[value.data()?.avtar], value.data()?.avtar); 
    }
  }, [dataloading, value, user]);

  return (
    <>
      <div
        className="text-white min-h-screen flex justify-center items-center"
        style={{
          backgroundColor: "#fff",
          opacity: 0.8,
          backgroundImage:
            "radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, #fff 1px)",
          backgroundSize: "40px 40px",
          backgroundPosition: "0 0, 20px 20px",
        }}
      >
        {loading ? (
          <h1>Loading...</h1>
        ) : user ? (
          dataloading ? (
            <h1>Loading...</h1>
          ) : userobj ? (
            <div className="profile-box-container">
              <aside class="profile-card">
                <header>
                  <a href="">
                    <img
                      src={
                        iconSrcList[userobj?.avtar] ||
                        "https://avataaars.io/?accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&facialHairColor=Platinum&clotheType=ShirtScoopNeck&clotheColor=White&eyeType=Happy&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Light"
                      }
                      class="hoverZoomLink"
                    />
                  </a>
                  <h1 className="font-bold">{userobj?.username}</h1>
                  <h2>{userobj?.email}</h2>
                </header>
                <div class="profile-bio">
                  <div>
                    <h1 className="font-bold">about me:</h1>
                    <p>{userobj?.about || "I like guys"}</p>
                  </div>
                  <div className="flex w-full justify-between">
                    <div
                      className="flex flex-col items-center justify-between cursor-pointer"
                      onClick={() => setfollowerspopup(true)}
                    >
                      <p className="text-2xl">{userobj?.followers?.length}</p>
                      <h3 className="font-bold">Followers</h3>
                    </div>
                    <div
                      className="flex flex-col items-center justify-between cursor-pointer"
                      onClick={() => setfollowingpopup(true)}
                    >
                      <p className="text-2xl">{userobj?.following?.length}</p>
                      <h3 className="font-bold ">Following</h3>
                    </div>
                  </div>
                  <button
                    className="logout-btn hover:bg-slate-600"
                    onClick={async () => {
                      const res = await signOut();
                      if (res) {
                        navigate("/login");
                        toast.success("Successfully logged out!");
                      } else {
                        toast.error(
                          "we are having trouble logging you out! Please try again!"
                        );
                      }
                    }}
                  >
                    Logout
                  </button>
                </div>
              </aside>
            </div>
          ) : null
        ) : (
          <Navigate to="/login" />
        )}
      </div>
      <AnimatePresence>
        {followerspopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl lg:w-1/5 m-[20px]"
            >
              <button
                onClick={() => setfollowerspopup(false)}
                className="absolute top-2 right-2"
              >
                <FaWindowClose />
              </button>
              <h2 className="text-xl font-bold mb-4">Followers</h2>
              {userobj?.followers.map((follower) => (
                <div key={follower.uid} className="flex items-center mb-2">
                  <FaUser
                    style={{
                      border: "1px solid black",
                      padding: 4,
                      borderRadius: "50%",
                      boxSizing: "content-box",
                      marginRight: "1vw",
                    }}
                  />
                  <p>
                    {follower.username}
                    <hr
                      style={{
                        color: "black",
                        borderColor: "black",
                        height: "5px",
                      }}
                    />
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {followingpopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
          >
            <motion.div
              initial={{ y: "-100vh" }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl lg:w-1/5 m-[20px]"
            >
              <button
                onClick={() => setfollowingpopup(false)}
                className="absolute top-2 right-2"
              >
                <FaWindowClose />
              </button>
              <h2 className="text-xl font-bold mb-4">Following</h2>
              {userobj?.following.map((followinguser) => (
                <div key={followinguser.uid} className="flex items-center mb-2">
                  <FaUser
                    style={{
                      border: "1px solid black",
                      padding: 4,
                      borderRadius: "50%",
                      boxSizing: "content-box",
                      marginRight: "1vw",
                    }}
                  />
                  <p>
                    {followinguser.username}{" "}
                    <hr
                      style={{
                        color: "black",
                        borderColor: "black",
                        height: "5px",
                      }}
                    />
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Profile;
