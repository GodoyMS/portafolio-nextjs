import React from "react";

import { technologies } from "../constants";
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { FaMinus, FaPlus } from "react-icons/fa";
const Stack = () => {
  const [techLogos, setTechLogos] = useState([]);

  const fetchPopulars = useMemo(() => {
    return async () => {
      await setTechLogos(technologies);
    };
  });

  useEffect(() => {
    fetchPopulars();
  }, []);

  const [currentItem, setCurrentItem] = useState(1);

  return (
    <div className=" px-4 w-full z-50  mx-auto">
      <h2 className=" ml-2  mb-4 font-black text-left text-white lg:text-[30px] text-[20px]  white-text">
        My Stack
      </h2>

      <div className=" flex w-full flex-col gap-6 z-50">
        {techLogos.map((e) => (
          <div key={e.id} className=" w-full flex flex-col gap-2">
            <button className="  shadow-2xl w-full  justify-between px-2" onClick={e?.id ===currentItem ? ()=>setCurrentItem(null):() => setCurrentItem(e.id)}>
              {" "}
              <h3
                className={` text-blue-400 ${
                  currentItem === e.id ? " bg-blue-600 bg-opacity-30 text-gray-100" : " bg-gray-800 sm:bg-gray-900"
                } px-2 py-4 rounded-md font-bold text-left flex justify-between items-center`}
              >
                {e.name}
                {e?.id===currentItem ? <FaMinus/> : <FaPlus/>}

              </h3>{" "}
            </button>
            {currentItem === e.id && <ul className=" grid grid-cols-2 mt-4 gap-2 px-2  space-y-2 ">
              {e.items.map((e) => (
                <li
                  className=" flex justify-start gap-2 my-1 items-center"
                  key={e.name}
                >
                  <Image
                    width={100}
                    className=" w-8 object-contain h-8"
                    height={100}
                    src={e.icon}
                  />
                  <span className=" font-sans text-lg text-gray-400">{e.name}</span>
                </li>
              ))}
            </ul>}
          </div>
        ))}
      </div>

      {/* <div className=" max-w-xl bg-slate-800 rounded-2xl px-16 py-8 ">
        <div className="flex  flex-row flex-wrap justify-center gap-10">
          {techLogos.map((technology) => (
            <div
              className=" group flex relative p-1 lg:p-4 rounded-full bg-slate-200"
              key={technology.name}
            >
              <img
                src={technology.icon.src}
                className=" h-7 w-7 lg:w-12 lg:h-12 "
              />
              <span
                className="group-hover:opacity-100 transition-opacity bg-gray-900 px-1 text-sm text-gray-100 rounded-md absolute left-1/2 
          -translate-x-1/2 translate-y-full opacity-0 m-4 mx-auto z-30"
              >
                {technology.name}
              </span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Stack;
