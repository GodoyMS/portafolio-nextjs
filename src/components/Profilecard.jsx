import { profile } from "@/assets";
import { UserIcon } from "@heroicons/react/24/outline";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { FaLinkedinIn } from "react-icons/fa";

import { FaGithub } from "react-icons/fa";

const Profilecard = () => {
  return (
    <>
      <div className="w-full px-4 bg-slate-800 bg-opacity-20  rounded-lg  shadow-2xl mx-auto ">
        <div className="flex flex-col items-center py-10">
          <img
            className=" mb-3 rounded-full w-60 h-60  object-cover object-center "
            src={`${profile.src}`}
            alt="Godoy Muñoz"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-100">
            Godoy Muñoz
          </h5>
          <span className="text-base  text-gray-300 ">
            Full Stack developer
          </span>

          <span className="text-xs mt-4 mb-2 md:mt-6  text-gray-400">
            Let's connect
          </span>
          <div className="flex space-x-3 ">
            <a
              href="https://www.linkedin.com/in/godoy-liam-solorzano/"
              target="_blank"
              class=" text-white p-2 rounded-full items-center inline-flex bg-blue-700  hover:bg-blue-800"
            >
              <FaLinkedinIn className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/GodoyMS"
              target="_blank"
              class=" text-white p-2 rounded-full items-center inline-flex bg-slate-900  hover:bg-black"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <Link href={"/hireme"}>
              <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200">
                Message
              </span>
            </Link>
          </div>

          <div className="px-6 py-4 ">
            <p className="py-2 text-gray-400 text-justify">
              Hello! My name is Godoy, a passionate full stack developer with an
              unwavering affinity for crafting captivating digital landscapes.
              My expertise spans across the realms of React and Node.js, where I
              orchestrate the creation of stunning, scalable web applications
              that center around elevating user experience and optimizing
              performance.
            </p>
            <p className="py-2 text-gray-400 text-justify">
              Fast-forward to today, and I’ve had the privilege of working at a
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                href={"https://www.monstruocreativo.com"}
              >
                {" "}
                Marketing agency
              </Link>
              , a{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                href={
                  "https://www.universidadperu.com/empresas/z-p-soluciones.php"
                }
              >
                Software agency
              </Link>
              , and a{"  "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                href={"https://www.facebook.com/mymdentalgroup15"}
              >
                Dental Clinic
              </Link>
              . My main focus these days is building accessible, inclusive
              products and digital experiences in high performance applications
            </p>{" "}
            <p className="py-2 text-gray-400 text-justify">
              I also recently launched a robust{" "}
              <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                href={"https://pascojobsperu.com/"}
              >
                Job Platform Android mobile application
              </Link>{" "}
              for a Peruvian region. and am about to launch a    <Link
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
                href={"https://app.novifycrm.com/"}
              >
                CRM for healthcare organizations
              </Link>{" "}
            </p>{" "}
            <div className="flex items-center mt-4 text-gray-200">
              <MapPinIcon className="w-6 h-6 " />
              <h1 className="px-2 text-sm">Peru</h1>
            </div>
            <div className="flex items-center mt-4  text-gray-200">
              <EnvelopeIcon className="w-6 h-6 " />

              <Link
                href={"mailto:godoyliam.dev@gmail.com"}
                className="px-2 text-sm"
              >
                godoyliam.dev@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profilecard;
