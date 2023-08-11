import React from 'react'
import { github } from '@/assets'
import { ComputerDesktopIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
const ProjectCard = ({information}) => {
  return (

  
        <div className="w-full bg-slate-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-center items-center relative">
            {!information.bigProject && (<div className=' absolute top-2 right-2 p-2  text-gray-200 text-xs rounded-md bg-[#430fd3]'> Small project </div>)}
            {information.workingOn && (<div className=' absolute top-10 -left-2 transform -rotate-45  p-2  text-gray-200 text-xs rounded-md bg-[#000000]'> Currently working on </div>)}

                <a className='w-full'><Image width={ 400} height={300} className="w-full h-full object-cover object" src={information.image} alt="photo"/></a>
           
            <div className="text-center py-8 sm:py-6">
                <p className="text-xl text-gray-300 font-bold mb-2">{information.name}</p>
                <p className="text-base text-gray-400 font-normal text-justify px-2">{information.description}</p>
            </div>
            <div className='flex justify-start w-full  gap-2 px-2 my-2 '>
                {information.tags.map((e)=>(
                    <span className='px-2 py-1 text-gray-100 rounded-lg bg-slate-600'> {e.name}</span>
                ))}
                <span></span>
            </div>

            <div className='flex justify-center    gap-2 px-2 my-4 '>
                <a href={information.gitHubLink} className='p-2 text-gray-50 bg-slate-900 rounded-lg flex gap-2 hover:bg-slate-700' > <span>Source code</span> <img src={github.src} className='h-6 w-6'/>  </a>
                <a href={information.demoLink} target='_blank' className='p-2 text-gray-50 bg-[#430fd3] rounded-lg flex gap-2 hover:bg-[#0f54d3]' > <span>View demo</span> <ComputerDesktopIcon className='h-6 w-6'/>  </a>

                <span></span>
            </div>
        </div>  
      
     
        
    

  )
}

export default ProjectCard