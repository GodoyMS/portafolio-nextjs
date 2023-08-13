import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Hero from "@/components/Hero/Hero";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Profilecard from "@/components/Profilecard";
import Stack from "@/components/Stack";
import EducationBlock from "@/components/EducationBlock/EducationBlock";
import WorkExperienceBlock from "@/components/WorkExperienceBlock/WorkExperienceBlock";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import OtherProjects from "@/components/OtherProjects/OtherProjects";

const Home = () => {
  return (
    <>
      <Head>
        <title>Godoy Liam Muñoz Portafolio</title>
        <meta name="description" content="Full stack developer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />

      <section id="about">
        <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-7xl mx-auto pt-20 relative ">
          <div
            className="absolute   inset-0 mx-auto   translate-x-1/2 translate-y-1/2 xl:translate-x-1/2 blur-[300px] max-w-lg h-[300px]  sm:max-w-4xl sm:h-[600px]"
            style={{
              zIndex: 0,
              background:
                "linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)",
            }}
          ></div>
          <Profilecard />
          <div className=" flex flex-col justify-center">
            <Stack />
          </div>
        </div>
        <div className=" max-w-6xl mx-auto py-40">
          <WorkExperienceBlock />

          <EducationBlock />
        </div>

        <div className=" "></div>
      </section>
      <section className=" py-20" id="projects">
        <div className=" mx-auto">
          <ProjectsSection />
        </div>

        <div className=" mx-auto">
          <OtherProjects />
        </div>
      </section>

      
    </>
  );
};
export default Home;
