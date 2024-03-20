import { zyp } from "@/assets";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaLink } from "react-icons/fa";

const WorkExperienceBlock = () => {
  const info = [
    {
      id: 5,
      title: "SoftOne",
      image: "/images/work/soft-one.jpg",
      job: "Frontend developer",
      details: (
        <p>
         Developing the frontend of a tech-education web application, focused on fast learning  and reading
      
      
        </p>
      ),
      date: "Feb, 2024 - Present",
      url: "https://www.soft-one.org",
      links: [
       
      ],
      skills: [
        { id: 12, name: "React" },
        { id: 13, name: "Nextjs" },
        { id: 15, name: "Tailwindcss" },
        { id: 25, name: "Bootstrap" },
        { id: 17, name: "NodeJS" },
        { id: 111, name: "Google Cloud" },


      ],
    },
    {
      id: 10,
      title: "InSource S.A.C.S",
      image: "/images/work/isperu_logo.jpeg",
      job: "Full Stack developer",
      details: (
        <p>
          Development of full stack web applications focused on ecommerce and
          CRM smart solutions for private companies. I developed the frontend of
          an ecommerce web app{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://tempano.net/"}
          >
            Tempano
          </Link>{" "}
          , also developed the frontend and the backend of an ecommere for Pet
          lovers{"  "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://app.pupicat.com/"}
          >
            PupiCat
          </Link>{" "}, 
          as well as an admin dashboard for their owners wich helps them promote
          and track their sales with partners and clients
      
        </p>
      ),
      date: "Setp, 2023 - Feb, 2024",
      url: "https://insource.pe",
      links: [
        {
          id: 1,
          name: "Tempano.com",
          link: "https://tempano.net/",
        },
        {
          id: 2,
          name: "Pupicat.com",
          link: "https://app.pupicat.com/",
        }
      ],
      skills: [
        { id: 12, name: "React" },
        { id: 13, name: "React Native" },
        { id: 15, name: "Tailwindcss" },
        { id: 25, name: "Bootstrap" },
        { id: 17, name: "NodeJS" },
        { id: 18, name: "GraphQL" },
        { id: 19, name: "MongoDB" },
        { id: 110, name: "Strapi" },
        { id: 111, name: "Google Cloud" },
        { id: 112, name: "Firebase" },


      ],
    },
    {
      id: 1,
      title: "Monstruo Creativo",
      image: "/images/work/mc.webp",
      job: "Full Stack project leader",
      details: (
        <p>
          With a small team of 3 people, we created a powerful marketing website{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://monstruocreativo.com"}
          >
            www.monstruocreativo.com
          </Link>{" "}
          , virtual classroom web application{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://monstruocreativo.academy"}
          >
            www.monstruocreativo.academy
          </Link>{" "}
          and a companies web application CRM to promote their brands, products
          and services{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://paginasdigitales.pe"}
          >
            www.paginasdigitales.pe
          </Link>{" "}
        </p>
      ),
      date: "May, 2023 - Sept, 2023",
      url: "https://monstruocreativo.com",
      links: [
        {
          id: 1,
          name: "Monstruocreativo.com",
          link: "https://monstruocreativo.com",
        },
        {
          id: 2,
          name: "Monstruocreativo.academy",
          link: "https://monstruocreativo.academy",
        },
        {
          id: 3,
          name: "Paginasdigitales.pe",
          link: "https://paginasdigitales.pe",
        },
      ],
      skills: [
        { id: 11, name: "Nextjs" },
        { id: 12, name: "React" },
        { id: 13, name: "React Native" },
        { id: 14, name: "ThreeJS" },
        { id: 15, name: "Tailwindcss" },
        { id: 16, name: "Framer Motion" },
        { id: 17, name: "NodeJS" },
        { id: 18, name: "GraphQL" },
        { id: 19, name: "MongoDB" },
        { id: 110, name: "PayloadCMS" },
      ],
    },
    {
      id: 2,
      title: "M & M Dental Group",
      image: "/images/work/mym.jpg",
      job: "Full Stack React-Node developer",
      details: (
        <p>
          I created a web based software system designed specifically to manage
          their patient information, appointments and billing for a Clinic{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={"https://www.facebook.com/mymdentalgroup15"}
            className="text-blue-500 hover:underline"
          >
            {" "}
            M & M Group{" "}
          </Link>
          . Built in the top of Nodejs and Nextjs
        </p>
      ),
      date: "Nov, 2022 - March,2023",
      url: "https://www.facebook.com/mymdentalgroup15",
      links: [
        {
          id: 1,
          name: "Clinic CRM",
          link: "https://alpha-clinicas.com",
        },
      ],
      skills: [
        { id: 21, name: "Nextjs" },
        { id: 22, name: "React" },
        { id: 23, name: "Tailwindcss" },
        { id: 24, name: "NodeJS" },
        { id: 25, name: "MongoDB" },
        { id: 26, name: "Redis" },
        { id: 27, name: "Material UI" },
        { id: 28, name: "Typescript" },
      ],
    },
    {
      id: 3,
      title: "Z & P Soluciones",
      image: "/images/work/zyp.png",
      job: "Frontend React developer",
      details: (
        <p>
          Created a front end User interface to expose information about
          services and work of
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://www.universidadperu.com/empresas/neo-energia.php"}
          >
            "Neo Energia"
          </Link>{" "}
          Company. Also I created a small ecommerce web application for an
          IronMongery Store{" "}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            href={"https://www.universidadperu.com/empresas/aceros-comex.php"}
          >
            Aceros Comex
          </Link>
        </p>
      ),
      date: "January, 2022 - May,2022",
      url: "https://www.universidadperu.com/empresas/z-p-soluciones.php",
      links: [
        {
          id: 1,
          name: "Landing page",
          link: "https://godoyms.github.io/Neo_energy/",
        },
        {
          id: 2,
          name: "Ecommerce",
          link: "https://acerox-comax-cra.vercel.app",
        },
      ],
      skills: [
        { id: 31, name: "PHP" },
        { id: 32, name: "React" },
        { id: 33, name: "HTML" },
        { id: 34, name: "CSS" },
        { id: 35, name: "Javascript" },
      ],
    },
  ];

  const [currentItem, setCurrentItem] = useState("");

  return (
    <>
      <div className=" p-5 mt-4  max-w-4xl ml-auto rounded-lg relative  ">
        <h3 className=" text-xl font-semibold text-gray-50 dark:text-white">
          Work Experience
        </h3>

        <div
          className="absolute   inset-0 mx-auto   translate-x-1/2 xl:-translate-x-1/2 blur-[300px] max-w-lg h-[300px]  sm:max-w-3xl sm:h-[700px]"
          style={{
            zIndex: 0,
            background:
              "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
          }}
        ></div>
        <ol className="mt-3 z-50  space-y-4 ">
          {info.map((e) => (
            <li
              key={e.id}
              onMouseEnter={() => setCurrentItem(e.id)}
              onMouseLeave={() => setCurrentItem("")}
              className="z-50 "
            >
              <Link
                style={{ zIndex: 900 }}
                href={e.url}
                target="_blank"
                rel="noopener noreferrer"
                className={` items-center ${
                  currentItem === e.id
                    ? " bg-blue-300 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 shadow-md"
                    : currentItem
                    ? "opacity-40  blur-[1px]"
                    : " "
                }   p-3 flex flex-col sm:grid grid-cols-12 rounded-md z-50 py-10`}
              >
                <div className=" hidden md:block z-40 col-span-3 h-full w-full mb-2 sm:mb-0">
                  <div className=" flex flex-col justify-start items-start w-full h-full">
                    <span
                      className={` w-full text-left items-start ${
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
                <div className=" flex flex-col sm:flex-row z-50 gap-2 col-span-9">
                  <Image
                    width={200}
                    height={200}
                    className="w-12 h-12 mb-3 mr-3 rounded-full sm:mb-0"
                    src={e.image}
                    alt="logo"
                  />
                  <div className=" block md:hidden z-40 col-span-3 h-full w-full mb-2 sm:mb-0">
                    <div className=" flex flex-col justify-start items-start w-full h-full">
                      <span
                        className={` w-full text-left items-start ${
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

                  <div className="text-gray-600 dark:text-gray-400">
                    <div className="text-base font-normal">
                      <span
                        className={` items-center ${
                          currentItem === e.id
                            ? " text-blue-300"
                            : currentItem
                            ? "text-white"
                            : " "
                        }   font-medium text-gray-200`}
                      >
                        {e.job} | {e.title}
                      </span>
                    </div>

                    <div
                      className={` items-center ${
                        currentItem === e.id
                          ? " text-gray-300"
                          : currentItem
                          ? "text-gray-500"
                          : " text-gray-500"
                      }   text-xs font-normal  `}
                    >
                      {e.details}
                    </div>
                    <div className="  py-4 flex justify-start gap-6 flex-wrap">
                      {e?.links.map((e) => (
                        <Link
                          className=" flex text-sm justify-start gap-2 items-center text-gray-300 hover:text-blue-400"
                          key={e.id}
                          href={e.link}
                          target="_blank"
                        >
                          <FaLink />
                          {e.name}
                        </Link>
                      ))}
                    </div>
                    <div className="  py-4 flex justify-start gap-2 flex-wrap">
                      {e?.skills.map((e) => (
                        <span
                          className=" bg-blue-600 text-blue-300 px-3 py-2 rounded-full bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20  flex text-sm justify-start gap-2 items-center "
                          key={e.id}
                        >
                          {e.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default WorkExperienceBlock;
