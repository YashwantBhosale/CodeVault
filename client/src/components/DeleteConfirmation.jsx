import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmation = ({ type, isOpen, onClose, onDelete }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50"
        >
          <motion.div
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
          >
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this {type}?</p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded-md mr-4"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmation;
