// utils/toaster.js
import { toast, Slide, Zoom, Flip, Bounce } from "react-toastify";

/**
 * Display a toast message
 * @param {'success' | 'error' | 'info' | 'warn'} type - The toast type
 * @param {string|object} message - Message or error object
 * @param {object} overrides - Optional config overrides
 */
export const Toaster = (type, message, overrides = {}) => {
  let finalMessage = "Something went wrong";

  if (typeof message === "string") {
    finalMessage = message;
  } else if (message?.response?.data?.message) {
    finalMessage = message.response.data.message;
  } else if (message?.response?.message) {
    finalMessage = message.response.message;
  } else if (message?.message) {
    finalMessage = message.message;
  } else if (typeof message?.toString === "function") {
    finalMessage = message.toString();
  }

  const toastType = ["success", "error", "info", "warn"].includes(type)
    ? type
    : "info";

  toast[toastType](finalMessage, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
    transition: Bounce,
    className: "rounded-xl shadow-lg top-20 p-4 text-sm font-bold rounded-md", 
    bodyClassName: "text-gray-700 font-bold", 
    progressClassName: "bg-blue-500", 
    ...overrides,
  });
};
