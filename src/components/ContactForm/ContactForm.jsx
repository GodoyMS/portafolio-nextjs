import { useRef } from "react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import Toast from "../Toast";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const handleCloseToast = () => setOpenToast(false);
    const [isLoading,setIsLoading]=useState(false)
  const resetValues = () => {
    setName("");
    setEmail("");
    setMessage("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    emailjs
      .send(
        "service_q6xyeto",
        "template_qnaprz6",
        {
          to_name: "Godoy",
          from_name: name,
          message: `Email: ${email}; message: ${message}`,
        },
        "q-nyLhorxGo4PIaur"
      )
      .then(
        (result) => {
          console.log(result.text);
          setOpenToast(true);
          resetValues();
        },
        (error) => {
          console.log(error.text);
        }
      ).then(()=>setIsLoading(false))
      .catch((e)=>console.log(e))
      
      
      
  };

  console.log(message);
  return (
    <>
      {openToast && (
        <Toast
          message={
            "Message sent successfully, I will get in touch with you soon."
          }
          isOpen={openToast}
          closeToast={handleCloseToast}
        />
      )}

      <div className="mt-24 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 mr-2 bg-gray-100 dark:bg-gray-800 sm:rounded-lg">
            <h1 className="text-4xl sm:text-5xl text-gray-800 dark:text-white font-extrabold tracking-tight">
              Get in touch
            </h1>
            <p className="text-normal text-lg sm:text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2">
              Fill in the form to start a conversation
            </p>

            <div className="flex items-center mt-8 text-gray-600 dark:text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                className="w-8 h-8 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="ml-4 text-md tracking-wide font-semibold w-40">
                Peru, Lima, 15487
              </div>
            </div>

            <div className="flex items-center mt-4 text-gray-600 dark:text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                className="w-8 h-8 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div className="ml-4 text-md tracking-wide font-semibold w-40">
                +51 913464041
              </div>
            </div>

            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-400">
              <svg
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                className="w-8 h-8 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div className="ml-4 text-md tracking-wide font-semibold w-40">
                godoyliam.dev@gmail.com
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 flex flex-col justify-center"
          >
            <div className="flex flex-col">
              <label htmlFor="name" className="hidden">
                Full Name
              </label>
              <input
                required
                type="name"
                value={name}
                onChange={(prev) => setName(prev.target.value)}
                name="user_name"
                id="name"
                placeholder="Full Name"
                className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col mt-2">
              <label htmlFor="email" className="hidden">
                Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(prev) => setEmail(prev.target.value)}
                name="user_email"
                id="email"
                placeholder="Email"
                className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col mt-2">
              <label htmlFor="message" className="hidden">
                Message
              </label>
              <textarea
                required
                rows={5}
                onChange={(prev) => setMessage(prev.target.value)}
                placeholder="Write your message"
                type="text"
                value={message}
                name="messsage"
                id="message"
                className="w-100 mt-2 py-3 px-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-400 dark:border-gray-700 text-gray-800 font-semibold focus:border-indigo-500 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="md:w-32 bg-indigo-600 hover:bg-blue-dark text-white font-bold py-3 px-6 rounded-lg mt-3 hover:bg-indigo-500 transition ease-in-out duration-300"
            >
              {isLoading ? "Sending ...": "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
