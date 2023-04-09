import React from "react";

import { technologies } from "../constants";
import { useMemo,useState,useEffect } from "react";
const Stack = () => {
  const [techLogos,setTechLogos]=useState([])

  const fetchPopulars=useMemo(()=>{
    return async()=>{
      await setTechLogos(technologies)
  
    }
  })

  useEffect(() => {
    fetchPopulars();
  }, []);
  
  return (
    <div className="col-span-4 px-4  sm:col-span-3 mx-auto">
        <h2 className=" ml-2  font-black text-center text-white lg:text-[30px] text-[20px]  white-text">
            Technologies I use
          </h2>
      <div className=" max-w-xl bg-slate-800 rounded-2xl px-16 py-8 ">
      
  
      
        <div className='flex  flex-row flex-wrap justify-center gap-10'>
          {techLogos.map((technology) => (
            <div  className=' group flex relative p-1 lg:p-4 rounded-full bg-slate-200' key={technology.name}>          
              <img src={technology.icon.src} className=" h-7 w-7 lg:w-12 lg:h-12 "/>
              <span className="group-hover:opacity-100 transition-opacity bg-gray-900 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
          -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto z-30">{technology.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stack;
