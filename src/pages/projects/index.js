import React from 'react'
import { projects } from '@/constants';

import ProjectCard from '@/components/ProjectCard/ProjectCard'
const index = () => {
  return (
    <>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
    {projects.map((project)=><ProjectCard key={project.key}   information={project}/>)}



    </div>
     
    </>
  )
}

export default index