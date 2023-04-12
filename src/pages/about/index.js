import Stack from '@/components/Stack'
import Profilecard from '@/components/Profilecard'
import EducationBlock from '@/components/EducationBlock/EducationBlock'
import WorkExperienceBlock from '@/components/WorkExperienceBlock/WorkExperienceBlock'

const index = () => {
  return (
    <>
       <section className=" grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-6xl mx-auto ">
          <Profilecard/>
          <Stack/>         
        </section>
        <section className=' mt-4 max-w-6xl mx-auto'>
          <EducationBlock/>
          <WorkExperienceBlock/>
        </section>
       

    </>
   
  )
}

export default index