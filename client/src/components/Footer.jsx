import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const Footer = () => {
  const [showContact, setShowContact] = useState(false);
  const [showDevs, setShowDevs] = useState(false);

  const toggleContact = () => setShowContact(!showContact);
  const toggleDevs = () => setShowDevs(!showDevs);

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-black text-white py-2 px-6 flex flex-col items-center sm:flex-row sm:justify-between text-md font-semibold">
      <div className="flex items-center mb-2 sm:mb-0">
        <FaGithub
          onClick={() => {
            window.location.href =
              "https://github.com/YashwantBhosale/CodeVault";
          }}
          className="m-3 cursor-pointer"
        />
        <a
          href="https://github.com/YashwantBhosale/CodeVault"
          target="_blank"
          rel="noopener noreferrer"
        >
          Made by Yashwant and Mehmood
        </a>
      </div>
      <div className="hidden sm:flex items-center space-x-4">
        <div className="relative">
          <button onClick={toggleDevs} className="text-white py-2 px-4">
            Meet the Devs
          </button>
          {showDevs && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-full mb-2 w-[15vw] left-0 bg-white text-black p-4 rounded shadow-lg"
            >
              <h3 className="font-semibold mb-2">Meet the Devs</h3>
              <ul>
                <li>
                  <a
                    href="https://github.com/YashwantBhosale"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <FaGithub />
                    <span>Yashwant Bhosale</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/Mehmood-Deshmukh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <FaGithub />
                    <span>Mehmood</span>
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
        <button
          onClick={() =>
            (window.location.href =
              "https://www.youtube.com/watch?v=dQw4w9WgXcQ")
          }
          className="text-white py-2 px-4"
        >
          Demo Video
        </button>
        <button onClick={toggleContact} className="text-white py-2 px-4">
          Contact
        </button>
      </div>

      {showContact && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-16 right-12 bg-white text-black p-4 rounded shadow-lg"
        >
          <h3 className="font-semibold">Contact Information</h3>
          <p>Email: codevault09@gmail.com</p>
        </motion.div>
      )}
    </footer>
  );
};

export default Footer;
