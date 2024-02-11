import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { FaExternalLinkAlt } from "react-icons/fa";

const EducationBlock = () => {
  const info = [
    {
      id: 1,
      title: "Birla Institute of Technology and Science",
      study: "Computer Science Bachellor",
      url: "https://www.bits-pilani.ac.in",
      date: "2023-2026",
      image: "/images/education/bits.png",
    },
    {
      id: 2,
      url: "https://www.utp.edu.pe",
      title: "Technological University of Peru",
      study: "Mecatronics Engineering",
      date: "2019-2022",
      image: "/images/education/utp.jpeg",
    },
    {
      id: 3,
      title: "Escalab Tech",
      url: "https://escalab.tech",
      study: "MERN Full Stack Developer",
      details:
        "Mongoose, Express, ReactJS, NodeJS, Redis, Deployment, Clean Arquitecture and Design patterns ",
      certificate: [
        {
          id: 1,
          name: "Certificate Web developer",

          link: "https://drive.google.com/file/d/1e631egb7rztKB5B_XsTuRyKGwJaqWYZQ/view",
        },
        {
          id: 2,
          name: "Certificate React developer",
          link: "https://drive.google.com/file/d/1vBesKNB-AwXjjFjG-cSnpOTk0GHNLAXu/view?usp=sharing",
        },
      ],
      date: "Nov,2022 - May,2023",
      image: "/images/education/escalab.png",
    },
    {
      id: 4,
      url: "https://www.coursera.org/meta-professional-certificates",
      title: "Meta | Coursera",
      study: "Meta Front End Developer | React",
      details: "ReactJS, UX/UI principles, Unit Testing and web development",
      certificate: [
        {
          id: 1,
          name: "Certificate",
          link: "https://www.coursera.org/account/accomplishments/specialization/certificate/SWHPWYGJNCRN",
        },
      ],
      date: "Oct, 2022 - March, 2023",
      image: "/images/education/meta.avif",
    },
    {
      id: 5,
      url: "https://www.britanico.edu.pe",
      title: "British Peruvian Cultural Association",
      study: "Advanced English language",
      certificate: [
        {
          id: 1,
          name: "Certificate",
          link: "https://drive.google.com/file/d/17Z3OV-N3zhKKJpDx6n3Pa045kTXB8mUa/view?usp=sharing",
        },
      ],
      date: "2020-2023",
      image: "/images/education/british.jpg",
    },
    {
      id: 6,
      title: "International Baccalaureate",
      url: "https://www.ibo.org/",

      study: "International Baccalaureate Diploma Programme",
      certificate: [
        {
          id: 1,
          name: "Diploma",
          link: "https://drive.google.com/file/d/1KNC02RcmrzzirXFqYm2-Li3u8R_bOrDN/view?usp=drive_link",
        },
      ],
      date: "2015-2017",
      image: "/images/education/ib.png",
    },
  ];
  const [currentItem, setCurrentItem] = useState("");

  return (
    <>
      <div className=" p-5 mb-4 pt-40 rounded-lg  max-w-4xl mr-auto relative">

      <div
          className="absolute   inset-0 mx-auto   translate-x-1/2 translate-y-1/2 xl:translate-x-1/2 blur-[400px] max-w-lg h-[300px]  sm:max-w-4xl sm:h-[600px]"
          style={{
            zIndex: 0,
            background:
              "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        ></div>
        <h3 className=" text-xl font-semibold text-gray-50 dark:text-white">
          Education
        </h3>
        <ol className="mt-3  space-y-2">
          {info.map((e) => (
            <li className=" ">
              <div key={e.id} className="items-center block p-3 sm:flex ">
                <Link
                  href={e?.url}
                  target="_blank"
                  className="  flex w-full hover:bg-blue-300 bg-clip-padding backdrop-filter backdrop-blur-md hover:bg-opacity-10 hover:shadow-md px-2 flex-col sm:grid grid-cols-12 sm:gap-4 rounded-md z-50 py-5"
                >
                  {" "}
                  <div className=" sm:col-span-9 flex ">
                    <Image
                      width={200}
                      height={200}
                      className="w-12 h-12 mb-3 mr-3 rounded-full sm:mb-0"
                      src={e.image}
                      alt="Escalab"
                    />{" "}
                    <div className="text-gray-600  dark:text-gray-400">
                      <div className="text-base font-normal">
                        <span className="font-medium text-gray-200">
                          {e.title}
                        </span>
                      </div>
                      <div className="text-sm font-normal text-gray-400">
                        {e.study}
                      </div>
                      <div className="text-xs font-normal text-gray-500 ">
                        {e?.details}
                      </div>
                      {e?.certificate && (
                        <div className=" flex flex-col py-2 ">
                          {e?.certificate?.map((e) => (
                            <Link
                              key={e.id}
                              href={e.link}
                              target="_blank"
                              className="text-sm font-normal text-blue-400 flex gap-2"
                            >
                              {e?.name}{" "}
                              <FaExternalLinkAlt className="h-4 w-4" />
                            </Link>
                          ))}
                        </div>
                      )}

                      
                    </div>
                  </div>

                  <div className=" hidden md:block z-40 col-span-3 h-full w-full mb-2 sm:mb-0">
                        <div className=" flex flex-col justify-start items-start w-full h-full">
                          <span
                            className={` w-full flex justify-end  items-center ${
                              currentItem === e.id
                                ? " text-gray-300"
                                : currentItem
                                ? "text-gray-500"
                                : "text-gray-500 "
                            }   uppercase font-sans font-bold inline-flex pt-1  text-xs  `}
                          >
                            <svg
                              aria-hidden="true"
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                            {e.date}
                          </span>
                        </div>
                      </div>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default EducationBlock;
