import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { iconSrcList } from "../utils/icons";
import { useAuthContext } from "../hooks/useAuthContext";

export const Autocomplete = ({ data }) => {
  const {user} = useAuthContext();
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();

  function formatResult(item) {
    return (
      <div key={item.username}>
        <div
          className="flex items-center"
          onClick={() => navigate(`/viewprofile?username=${item.username}`)}
        >
          <img
            src={item.avtar.length > 15 ? item.avtar : iconSrcList[item.avtar]}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3">{item.username}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto my-10 w-[80%] md:w-[50%]">
      <ReactSearchAutocomplete
        items={data}
        onClear={() => setSearchString("")}
        onSelect={(value) => {
          console.log(value);
          if (value.username === user.username) {
            navigate("/profile");
          } else {
            navigate(`/viewprofile?username=${value.username}`);
          }
        }}
        fuseOptions={{ keys: ["username"] }}
        placeholder="Search for a user"
        formatResult={formatResult}
        autoFocus
        styling={{ zIndex: 1 }}
      />
    </div>
  );
};
