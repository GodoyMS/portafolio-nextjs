import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Hero from '@/components/Hero/Hero'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import {EnvelopeIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'

const Home = () => {
  return (
    <>
      <Head>
        <title>Godoy Liam Muñoz Portafolio</title>
        <meta name="description" content="Full stack developer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Hero/>
        <div className='flex justify-center gap-2'>
          <Link href={"resume.pdf"} download={true} target='_blank'> <button className=' inline-flex gap-2   rounded-lg   px-3 py-2.5 text-base font-semibold leading-7 text-gray-100 bg-[#4a61e6]  hover:bg-[#1560b6]'> Resume <ArrowDownTrayIcon className='h-6 w-6 text-gray-200' /></button></Link>
          <Link href={"mailto:peruvalmundial@gmail.com"}><button className='inline-flex gap-2 rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-100 bg-slate-800 hover:bg-gray-900'>Contact <EnvelopeIcon className="w-6 h-6 text-gray-200"/></button></Link>

        </div>

        
      </main>
    </>
  )
}
export default Home;

