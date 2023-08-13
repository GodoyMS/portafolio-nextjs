import { zyp } from "@/assets";
import { projects } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaGithub, FaLink } from "react-icons/fa";
import { BiArchive, BiLogoPlayStore } from "react-icons/bi";
const OtherProjects = () => {
  const [currentItem, setCurrentItem] = useState("");

  return (
    <>
      <div className=" p-5 mt-4 pt-40  max-w-6xl mx-auto rounded-lg relative  ">
        <h3 className=" text-xl text-center sm:text-3xl font-semibold text-gray-50 dark:text-white">
          Other Noteworthy Projects
        </h3>

        <div
          className="absolute   inset-0 mx-auto   translate-x-1/2 xl:-translate-x-1/2 blur-[300px] max-w-lg h-[300px]  sm:max-w-3xl sm:h-[700px]"
          style={{
            zIndex: 0,
            background:
              "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        ></div>
        <div className="mt-3 z-50 block sm:grid sm:grid-cols-3 gap-2  h-full  ">
          {projects
            .filter((e) => e.other)
            .map((e) => (
              <div
                key={e.key}
                onMouseEnter={() => setCurrentItem(e.key)}
                onMouseLeave={() => setCurrentItem("")}
                className="z-50 h-full bg-gray-400 bg-opacity-10 my-4 sm:my-0 rounded-md  "
              >
                <Link
                  style={{ zIndex: 900 }}
                  href={e?.demoLink ? e.demoLink : e.gitHubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={` items-center ${
                    currentItem === e.key
                      ? " bg-blue-300 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-5 shadow-md"
                      : currentItem
                      ? "opacity-80  blur-[0.2px]"
                      : " "
                  }   p-3 flex  gap-10 flex-col justify-between h-full z-50 py-10 rounded-md`}
                >
                  <div className="flex-1 flex flex-col  z-50 gap-2 col-span-6">
                   
                    <div className=" block flex-1  z-40 col-span-3 h-full w-full  ">
                      <div className=" px-4 py-1 flex flex-col justify-start items-start w-full h-full">
                        <Image
                          className=" w-full  h-full rounded-md object-cover"
                          width={400}
                          height={300}
                          src={e.image}
                          alt={e.name}
                        />
                      </div>
                    </div>

                    <div className="text-gray-600 dark:text-gray-400">
                      <div className="text-base font-normal">
                        {e?.featured && (
                          <span className=" text-blue-400 text-xs ">
                            FEATURED PROJECT
                          </span>
                        )}
                        <h4
                          className={` items-center ${
                            currentItem === e.key
                              ? " text-blue-200"
                              : currentItem
                              ? "text-white"
                              : " "
                          }   font-medium text-gray-200 text-xl`}
                        >
                          {e.name}
                        </h4>
                      </div>

                      <div
                        className={` items-center ${
                          currentItem === e.key
                            ? " text-gray-300"
                            : currentItem
                            ? "text-gray-500"
                            : " text-gray-500"
                        }   text-xs font-normal  `}
                      >
                        {e.description}
                      </div>

                      <div className="  py-4 flex justify-start gap-2 flex-wrap">
                        {e?.tags.map((e) => (
                          <span
                            className=" bg-blue-600 text-blue-300 px-3 py-2 rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20  flex text-sm justify-start gap-2 items-center "
                            key={e.name}
                          >
                            {e.name}
                          </span>
                        ))}
                      </div>
                      <div className=" flex justify-start gap-4 flex-wrap items-center">
                        {e?.playstoreLink && (
                          <Link href={e?.playstoreLink}>
                            <svg
                              className="w-6  h-6"
                              fill="#ffff"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              x="0px"
                              y="0px"
                              viewBox="0 0 512.001 512.001"
                            >
                              <path d="M464.252,212.09L99.624,8.07C84.247-1.873,64.754-2.691,48.574,5.967C32.183,14.74,22,31.737,22,50.329v411.342 c0,18.592,10.183,35.59,26.573,44.361c16.097,8.617,35.593,7.891,51.052-2.101l364.628-204.022 c16.121-9.02,25.747-25.435,25.747-43.908C490,237.527,480.374,221.111,464.252,212.09z M341.677,181.943l-50.339,50.339 L113.108,54.051L341.677,181.943z M55.544,467.323V44.676L267.621,256L55.544,467.323z M113.108,457.949l178.232-178.231 l50.339,50.339L113.108,457.949z M447.874,270.637l-75.779,42.401l-57.038-57.037l57.037-57.037l75.778,42.4 c7.746,4.335,8.583,11.68,8.583,14.637C456.455,258.958,455.62,266.302,447.874,270.637z"></path>
                            </svg>
                          </Link>
                        )}
                        {e?.gitHubLink && (
                          <Link target="_blank" href={e?.gitHubLink}>
                            <FaGithub className=" w-6 h-6 text-gray-200 hover:text-blue-400" />
                          </Link>
                        )}
                        {e?.demoLink && (
                          <Link target="_blank" href={e?.demoLink}>
                            <FaLink className=" w-6 h-6 text-gray-200 hover:text-blue-400" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default OtherProjects;
