import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBell,
  FaBroom,
  FaBrush,
  FaCheck,
  FaDumbbell,
  FaEraser,
  FaPaintBrush,
  FaRegBell,
  FaUser,
  FaWindowClose,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import { SyncLoader } from "react-spinners";
import { useLogout } from "../hooks/useLogout";

import { AnimatePresence, motion } from "framer-motion";
import { iconSrcList } from "../utils/icons";
import { useAuthContext } from "../hooks/useAuthContext";
export default function Header(props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useLogout();
  const [notifications, setnotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  // const [user, loading, error] = useAuthState(auth);
  const { user } = useAuthContext();

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  async function getNotifications() {
    try {
      setNotificationsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BASE_URL + "api/user/getnotifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user?.username,
          }),
        }
      );
      console.log(response);
      const data = await response.json();
      console.log(data.notifications.reverse());
      setnotifications(data.notifications);
      let unread = data.notifications.filter(
        (notification) => !notification.isSeen
      );
      setUnreadNotifications(unread);
    } catch (error) {
      console.log(error.message);
    }
    setNotificationsLoading(false);
  }

  const calculateTimeAgo = (createdAt) => {
    const currentTime = new Date();
    const postTime = new Date(createdAt);
    const timeDifference = currentTime - postTime;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? "s" : ""} ago`;
    } else {
      return `${minutesDifference} minute${
        minutesDifference > 1 ? "s" : ""
      } ago`;
    }
  };

  async function updateReadStatus(unreads) {
    console.log("unreads : ", unreads);
    try {
      setUnreadNotifications((prev) =>
        prev.filter((item) => !unreads.includes(item._id))
      );
      unreads.forEach((id) => {
        updateReadStatusLocal(id);
      });
      console.log("after clearing notification status : ", unreads);
      const response = await fetch(
        process.env.REACT_APP_BASE_URL + "api/user/readnotifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user?.username,
            notificationIds: unreads,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Read status updated successfully!");
      } else {
        toast.error("Error updating read status!");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error updating read status!");
    }
  }

  async function handleNotificationClear(ids) {
    console.log(ids);
    setnotifications((prev) => prev.filter((item) => !ids.includes(item._id)));
    setUnreadNotifications((prev) =>
      prev.filter((item) => !ids.includes(item._id))
    );

    try {
      const response = await fetch(
        process.env.REACT_APP_BASE_URL + "api/user/clearnotifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: user?.username,
            ids,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Notifications cleared successfully!");
      } else {
        toast.error("Error clearing notifications!");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error clearing notifications!");
    }
  }

  function createNotifications(notification, index) {
    let content = notification?.content;
    let username = "";
    let link = null;
    switch (notification?.type) {
      case "Follow": {
        username = content.substring(1, content.lastIndexOf(`"`));
        content = `${content.substring(
          content.lastIndexOf(`"`) + 1,
          content.length - 1
        )}`;
        link = `/viewprofile?username=${username}`;
        break;
      }
      case "Post": {
        username = content.substring(1, content.lastIndexOf(`"`));
        content = `${content.substring(
          content.lastIndexOf(`"`) + 1,
          content.length - 1
        )}`;
        console.log(notification.postId);
        if (notification?.postId) link = `/viewpost?id=${notification?.postId}`;
        break;
      }
    }

    return (
      <div
        key={index}
        className="flex items-center gap-4 px-4 py-4 border-b border-gray-300 text-sm"
        onClick={(e) => {
          e.stopPropagation();
          if (link) {
            navigate(link);
            setNotificationsOpen(false);
          }
        }}
      >
        <FaRegBell className="text-xl" />
        <p className="w-full ">
          {notification?.type == "Post" ? (
            <span>
              <span
                className="text-sky-500 cursor-pointer"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate(`/viewprofile?username=${username}`);
                }}
              >
                @{username}
              </span>{" "}
              <span>{content}</span>
            </span>
          ) : null}
          {notification?.type == "Follow" ? (
            <span>
              <span
                className="text-sky-500 cursor-pointer"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate(`/viewprofile?username=${username}`);
                }}
              >
                @{username}
              </span>{" "}
              <span>{content}</span>
            </span>
          ) : null}
          {notification?.type != "Follow" && notification?.type != "Post" ? (
            <span>{content}</span>
          ) : null}
        </p>
        <span className="whitespace-nowrap">
          {notification?.timestamp
            ? calculateTimeAgo(notification?.timestamp)
            : "11:11"}
        </span>
        {!notification?.isSeen && (
          <span
            title="Mark as read"
            className="cursor-pointer border border-gray-200 hover:bg-gray-100 bg-white p-2 rounded inline-flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              let temp = [notification._id];
              updateReadStatus(temp);
            }}
          >
            <FaCheck />
          </span>
        )}
        <button
          onClick={() => {
            handleNotificationClear([notification._id]);
          }}
        >
          <FaEraser />
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);
  // console.log("userobj : ", userObj);

  // local read status update
  async function updateReadStatusLocal(id) {
    const notificationToUpdate = notifications.find(
      (notification) => notification._id === id
    );
    if (notificationToUpdate) {
      notificationToUpdate.isSeen = true;
    }
    setnotifications(notifications); // assuming setNotifications updates the state
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-[10vh] bg-white z-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
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
                      src={
                        user?.avtar?.length > 15
                          ? user.avtar
                          : iconSrcList[user.avtar]
                      }
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
                  <Popover.Panel className="absolute left-5 top-full z-10 mt-3 w-32 overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
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
                          try {
                            logout();
                            navigate("/login");
                            toast.success("Logout successful!");
                          } catch (error) {
                            toast.error("Error logging out!");
                            console.log("error logging out : ", error.message);
                          }
                        }}
                        className="block font-semibold cursor-pointer text-gray-900 hover:bg-grey"
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
          <div className="flex items-center lg:hidden">
            <a
              className="relative text-md leading text-gray-900 cursor-pointer mr-8"
              onClick={() => setNotificationsOpen(true)}
            >
              {user && unreadNotifications.length > 0 ? (
                <p className="absolute bottom-2 left-2 bg-red-700 text-white p-[1px] px-[5px] rounded-full text-xs">
                  {unreadNotifications.length > 9? '9+': unreadNotifications.length}
                </p>
              ) : null}
              {user ? <FaBell /> : null}
            </a>
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
              className="relative text-md leading-6 text-gray-900 cursor-pointer"
              onClick={() => setNotificationsOpen(true)}
            >
              {user && unreadNotifications.length > 0 ? (
                <p className="absolute bottom-2 left-2 bg-red-700 text-white p-[1px] px-[5px] rounded-full text-xs">
                  {unreadNotifications.length > 9? '9+': unreadNotifications.length}
                </p>
              ) : null}
              {user ? <FaBell /> : null}
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
              className="text-md font-semibold leading-6 text-gray-900 cursor-pointer"
            >
              Explore
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/news");
              }}
              className="text-md font-semibold leading-6 text-gray-900 cursor-pointer"
            >
              News
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
              className="text-md font-semibold cursor-pointer leading-6 text-gray-900"
            >
              About
            </a>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/favourites");
              }}
              className="cursor-pointer text-md font-semibold leading-6 text-gray-900"
            >
              Favourites
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
          <div className="fixed inset-0 z-1000" />
          <Dialog.Panel className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 z-50">
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
                    className="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Home
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/explore");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Explore
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/news");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    News
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/about");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    About
                  </a>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/favourites");
                      setMobileMenuOpen(false);
                    }}
                    className="-mx-3 cursor-pointer block rounded-lg px-3 py-2 text-md font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Favourites
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
              initial={{ y: "-20px", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              // transition={{ type: "spring", stiffness: 150 }}
              className="bg-white p-8 rounded-xl w-full lg:w-2/5 m-[20px] max-h-[60vh] overflow-y-scroll min-h-[300px]"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotificationsOpen(false);
                }}
              >
                <FaWindowClose />
              </button>
              <button
                className="mx-5"
                onClick={() => {
                  getNotifications();
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </button>
              <button
                onClick={() => {
                  handleNotificationClear(
                    notifications.map((notification) => notification._id)
                  );
                }}
              >
                <FaEraser />{" "}
              </button>
              <button
                className="cursor-pointer border border-gray-200 hover:bg-gray-100 bg-white p-2 rounded inline-flex items-center justify-center mx-5"
                title="Mark all as read"
                onClick={() => {
                  updateReadStatus(
                    notifications
                      .filter((notification) => !notification.isSeen)
                      .map((notification) => notification._id)
                  );
                  setUnreadNotifications([]);
                }}
              >
                <FaCheck />
              </button>
              {notificationsLoading ? (
                <SyncLoader className="w-fit mx-auto mt-4" />
              ) : notifications.length ? (
                notifications.map((notification) =>
                  notification ? createNotifications(notification) : null
                )
              ) : (
                <h1 className="text-center text-slate-400 mt-[50px]">
                  No New notifications!
                </h1>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
