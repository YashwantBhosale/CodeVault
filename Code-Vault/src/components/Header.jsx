import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import {
  FaBell,
  FaDumbbell,
  FaRegBell,
  FaUser,
  FaWindowClose,
} from "react-icons/fa";

import { FadeLoader } from "react-spinners";
import { useLogout } from "../hooks/useLogout";

import { AnimatePresence, motion } from "framer-motion";
import { iconSrcList } from "../utils/icons";
export default function Header(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const {logout} = useLogout();
  // const [user, loading, error] = useAuthState(auth);
  const user = props.userObj;

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  function getHoursAndMinutesFromTimestamp(timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function createNotifications(notification) {
    return (
      <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-300">
        <FaRegBell />
        <p className="w-4/5">{notification.data}</p>
        <span className="absolute right-10">
          {notification.timestamp
            ? getHoursAndMinutesFromTimestamp(notification.timestamp)
            : "11:11"}
        </span>
      </div>
    );
  }
  // console.log("userobj : ", userObj);
  return (
    <>
      <header className="bg-white fixed top-0 left-0 w-full bg-white z-50">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            {user ? (
              <Popover className="relative">
                <Popover.Button className="flex items-center gap-x-1 text-md font-semibold leading-6 text-gray-900">
                  {(
                    <img
                      src={iconSrcList[user.avtar]}
                      className="hoverZoomLink w-8 h-8 rounded-full object-cover mx-3"
                    />
                  ) || <FaUser />}
                  {user.username || "User"}
                  <ChevronDownIcon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-32 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                    <div className="p-4">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/profile");
                        }}
                        className="block font-semibold text-gray-900 cursor-pointer hover:bg-grey"
                      >
                        View Profile
                        {/* <span className="absolute inset-0" /> */}
                      </a>
                      <a
                        onClick={async () => {
                          try{
                            logout();
                            navigate('/login');
                            toast.success("Logout successful!");
                          }catch(error){
                            toast.error("Error logging out!");
                            console.log("error logging out : ", error.message);
                          }
                          
                          
                        }}
                        className="block font-semibold text-gray-900 hover:bg-grey"
                      >
                        Logout
                        {/* <span className="absolute inset-0" /> */}
                      </a>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ) : null}
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12 items-center">
            <a
              className="text-md leading-6 text-gray-900 cursor-pointer"
              onClick={() => setNotificationsOpen(true)}
            >
              <FaBell />
            </a>
            <a
              className="text-md font-semibold leading-6 text-gray-900 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                user ? navigate("/home") : navigate("/login");
              }}
            >
              Home
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/explore");
              }}
              className="text-md font-semibold leading-6 text-gray-900"
            >
              Explore
            </a>
            <a
              href=""
              className="text-md font-semibold leading-6 text-gray-900"
            >
              About
            </a>
          </div>
          {!user ? (
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="text-md font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          ) : null}
        </nav>
        <Dialog
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                {/* <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              /> */}
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      user ? navigate("/home") : navigate("/login");
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Home
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/explore");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Explore
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/home");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    About
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      <AnimatePresence>
        {notificationsOpen && (
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
              className="bg-white p-8 rounded-xl lg:w-2/5 m-[20px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(false);
                }}
              >
                <FaWindowClose />
              </button>
              {/* {userObjloading ? (
                <FadeLoader />
              ) : userObj.data() ? (
                <div className="flex flex-col">
                  {userObj.data().notifications?.map(createNotifications)}
                </div>
              ) : (
                "No new notifications"
              )} */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
