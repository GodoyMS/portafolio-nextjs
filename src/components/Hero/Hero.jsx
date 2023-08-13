import React from "react";
import { ComputersCanvas } from "@/canvas";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDownTrayIcon,
  DocumentMagnifyingGlassIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  heroHeadText:
    "font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[#dfd9ff] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]",

  sectionHeadText:
    "text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px]",
  sectionSubText:
    "sm:text-[18px] text-[14px] text-secondary uppercase tracking-wider",
};
const Hero = () => {
  return (
    <section
      id="home"
      className={`relative w-full  justify-center h-[80vh] md:h-[80vh]  flex flex-col  max-w-7xl mx-auto  md:grid grid-cols-12`}
    >
      <div
        className="absolute   inset-0 mx-auto   translate-x-1/2 translate-y-1/2 xl:translate-x-1/2 blur-[100px] max-w-lg h-[300px]  sm:max-w-4xl sm:h-[600px]"
        style={{
          zIndex: 0,
          background:
            "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
        }}
      ></div>
      <div
        className={`${styles.paddingX} col-span-7 flex flex-row items-center gap-5`}
      >
        <div className="hidden md:flex flex-col justify-center items-center mt-5  ">
          <div className="w-5 h-5 rounded-full bg-[#1560b6]" />
          <div className="w-4 h-4 mt-2 rounded-full bg-[#1560b6]" />
          <div className="w-3 h-3 mt-2 rounded-full bg-[#1560b6]" />
          <div className="w-2 h-2 mt-2 rounded-full bg-[#1560b6]" />
          <div className="w-1 h-1 mt-2 rounded-full bg-[#1560b6]" />
        </div>

        <div className="  ">
          <span className=" text-gray-400 text-2xl">Hi, my name is</span>
          <h1 className="font-bold  text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] white-text">
            <span className="text-[#4a61e6]">Godoy Muñoz</span>
          </h1>
          <h2 className="font-semibold font-sans text-gray-300 lg:text-[50px] sm:text-[30px] xs:text-[20px] text-[20px] lg:leading-[98px]  white-text ">
            {" "}
            A full stack developer{" "}
          </h2>
          <p className="text-gray-400 font-light lg:text-[20px] text-justify sm:text-[22px] text-[15px] lg:leading-[40px] mt-2 text-white-100">
            I develop end to end high performance web applications{" "}
            <br className="sm:block hidden" />
            using the most in-demand technologies. Currently, I'm dedicated to
            spearheading innovative projects and crafting robust, accessible
            software while actively contributing to the dynamic team at{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={"https://monstruocreativo.com"}
              className=" text-blue-400 hover:underline"
            >
              Monstruo Creativo
            </a>
          </p>

          <div className="flex justify-start flex-wrap mt-10 gap-4">
            <Link href={"/GodoyMS_Resume.pdf"}  target="_blank">
              <div className=" inline-flex gap-2   rounded-md  font-bold  px-10 py-2.5 text-base  leading-7 hover:text-white hover:bg-blue-600 transition duration-300 hover:animate-pulse  bg-blue-600 border-2 border-blue-700   text-white  hover:border-[#1560b6]">
                Resume{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
            </Link>
            <Link href={"/hireme"}>
              {" "}
              <div className=" inline-flex gap-2   rounded-md  font-bold  px-10 py-2.5 text-base  leading-7 hover:text-indigo-400 transition duration-300 hover:border-indigo-400  border-blue-400 border-2   text-blue-400  ">
                {" "}
                Contact <EnvelopeIcon className="w-6 h-6 " />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className=" hidden md:block md:col-span-5 flex-1 h-auto relative">
        <ComputersCanvas />

        <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
          <a href="#about">
            <div className="h-[35px] w-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
              <motion.div
                animate={{
                  x: [0, 20, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-3 h-3 rounded-full relative right-2  bg-white  "
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
