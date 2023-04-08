import Stack from '@/components/Stack'
import Profilecard from '@/components/profilecard'

const index = () => {
  return (
    <>
       <div className=" grid grid-cols-4 gap-4 max-w-6xl mx-auto ">
       <Profilecard/>
       <Stack/>      
        </div>

    </>
   
  )
}

export default index