import {  useState } from 'react'
import { Dialog, Popover } from '@headlessui/react';
import Link from "next/link"
import { 
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import { useRouter } from 'next/router';

const menuLinks=[{title:'Home', Link:'/'},{title:'About',Link:'/about'},{title:'Projects',Link:'/projects'},{title:'Hire Me',Link:'/hireme'}]
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter();
  const subpage = router.pathname; 

  return (
    <header >
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <span className='-mx-3 block rounded-lg px-3 py-2 text-base leading-7 text-[#4a61e6] font-bold'  >GODOY DEV</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex lg:gap-x-12">

                {menuLinks.map((link)=>(
                            link.title!=="Hire Me" &&(
                                        <Link  href={link.Link}  className={`text-sm block rounded-lg px-3 py-2 font-semibold leading-6 text-gray-300  hover:bg-gray-800 ${link.Link===subpage ? "bg-gray-800": ""}`}>
                                            {link.title}
                                        </Link>
                                        
                                        )
                                )
                             )
                }               
        </Popover.Group>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">

        {menuLinks.map((link)=>(
                            link.title==="Hire Me" &&(
                                    <Link  href={link.Link}  className="text-sm transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none hover:bg-slate-600 block rounded-lg px-3 py-2 font-semibold leading-6 text-gray-100 bg-slate-700">
                                            {link.title} <span aria-hidden="true">&rarr;</span>
                                        </Link>
                                    
                                        )
                                )
                             )
                } 
          
        </div>
      </nav>


      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-slate-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Developer</span>
              <span className='-mx-3 block rounded-lg px-3 py-2 text-base leading-7  text-[#4a61e6] font-bold'  >GODOY DEV</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menuLinks.map((link)=>(
                    link.title!=="Hire Me" &&(
                        <Link  href={link.Link}  onClick={()=>setMobileMenuOpen(false)} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900">
                                            {link.title}
                        </Link>
                        
                    )
                    

                ))}               
              </div>
              <div className="py-6">
              {menuLinks.map((link)=>(
                    link.title==="Hire Me" &&(
                        <Link href={link.Link}
                        onClick={()=>setMobileMenuOpen(false)} 
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900">
                                            {link.title}
                        </Link>                        
                    )
                ))}  

                
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}