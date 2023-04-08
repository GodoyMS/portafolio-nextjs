import React from 'react'
import  { ComputersCanvas } from '@/canvas';

import { motion } from 'framer-motion';
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
    <section className={`relative w-full h-[85vh] mx-auto`}>
      <div
        className={`absolute inset-0 top-[80x]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#1560b6]' />
          <div className='w-4 h-4 mt-2 rounded-full bg-[#1560b6]' />
          <div className='w-3 h-3 mt-2 rounded-full bg-[#1560b6]' />
          <div className='w-2 h-2 mt-2 rounded-full bg-[#1560b6]' />
          <div className='w-1 h-1 mt-2 rounded-full bg-[#1560b6]' />

        </div>

        <div>
          <h1 className="font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2 white-text">
            Hi, I'm <span className='text-[#4a61e6]'>Godoy</span>
          </h1>
          <h2 className='font-black text-slate-400 lg:text-4xl text-2xl'> A full stack developer </h2>
          <p className='text-[#dfd9ff] font-medium lg:text-[20px] sm:text-[22px] xs:text-[15px] text-[20px] lg:leading-[40px] mt-2 text-white-100' >
            I develop end to end high performance web applications <br className='sm:block hidden' />
            using the most in-demand technologies
          </p>
        </div>
      </div>

      <ComputersCanvas />

      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='h-[35px] w-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2'>
            <motion.div
              animate={{
                x: [0, 20,0],
                
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full relative right-2  bg-white  '
            />
          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero