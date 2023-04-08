import { profile } from "@/assets"
import { UserIcon } from "@heroicons/react/24/outline"
import {MapIcon} from "@heroicons/react/24/outline"
import {EnvelopeIcon} from "@heroicons/react/24/outline"
const Profilecard = () => {
  return (
    <div className="w-full max-w-sm overflow-hidden mx-auto my-4 col-span-4 sm:col-span-1 rounded-lg shadow-lg">
    <img className="object-cover object-center w-full h-80" src={`${profile.src}`} alt="avatar"/>

        <div className="flex items-center px-6 py-3 bg-gray-900">
            <UserIcon className="h-6 w-6 text-white" />

            <h1 className="mx-3 text-lg font-semibold text-white">Focusing</h1>
        </div>

        <div className="px-6 py-4 bg-slate-800">
            <h1 className="text-xl font-semibold text-white">Godoy Muñoz</h1>
            <p className="py-2 text-gray-400">Passionate full stack developer with expertise in React and Node.js, creating beautiful and scalable web applications with a focus on user experience and performance</p>
            <div className="flex items-center mt-4 text-gray-200">
                <MapIcon className="w-6 h-6 fill-current"/>
                <h1 className="px-2 text-sm">Peru</h1>
            </div>

            <div className="flex items-center mt-4  text-gray-200">
                <EnvelopeIcon className="w-6 h-6 fill-current"/>

                <h1 className="px-2 text-sm">peruvalmundial@gmail.com</h1>
            </div>
        </div>
        
    </div>
  )
}

export default Profilecard