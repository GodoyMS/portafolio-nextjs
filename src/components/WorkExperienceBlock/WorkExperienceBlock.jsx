import { zyp } from '@/assets'
import React from 'react'
   

const WorkExperienceBlock = () => {
  return (
    <>
    
        <div className=" p-5 mt-4 rounded-lg bg-slate-800">
            
            <h3 className=" text-xl font-semibold text-gray-50 dark:text-white">Work Experience</h3>
            <ol className="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
                <li>
                    <a href="https://www.universidadperu.com/empresas/z-p-soluciones.php" target='_blank' className="items-center block p-3 sm:flex ">
                        <img className="w-12 h-12 mb-3 mr-3 rounded-full sm:mb-0" src={zyp.src} alt="Z & P Soluciones"/>
                        <div className="text-gray-600 dark:text-gray-400">
                            <div className="text-base font-normal"><span className="font-medium text-gray-200">Z & P Soluciones</span></div>
                            <div className="text-sm font-normal text-gray-400">Front End developer</div>
                            <div className="text-xs font-normal text-gray-500 ml-4">Created a front end User interface to expose information about services and work of <a href='https://www.universidadperu.com/empresas/neo-energia.php' className="text-blue-400" target='_blank'>"Neo Energia"  </a>Company </div>

                            <span className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                                <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path></svg>
                                January, 2022 - May,2022
                            </span> 
                        </div>
                    </a>
                </li>
                <li>
                    <a href='https://www.facebook.com/mymdentalgroup15' target='_blank' className="items-center block p-3 sm:flex ">
                        <img className="w-12 h-12 mb-3 mr-3 rounded-full sm:mb-0" src="https://scontent.flim2-2.fna.fbcdn.net/v/t39.30808-6/330830655_995062675194236_3692100036596753569_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=aA4AIRGczHIAX9uFkGc&_nc_ht=scontent.flim2-2.fna&oh=00_AfAnKt11KdsMPyYnzS1uYB1FQCy2L0kV_Yhu8bUdAOOVuA&oe=643B383E" alt="M & M Dental Group"/>

                        <div className="text-gray-600 dark:text-gray-400">
                            <div className="text-base font-normal"><span className="font-medium text-gray-200">M & M Dental Group</span></div>
                            <div className="text-sm font-normal text-gray-400">Full stack PHP developer </div>
                            <div className="text-xs font-normal text-gray-500 ml-4">Created a web based software system designed specifically  to manage their patient information, appointments and billing </div>


                            <span className="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                                <svg aria-hidden="true" className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path></svg>
                                Nov,2022 - May,2023
                            </span> 
                        </div>
                    </a>
                </li>
                
                
            </ol>
        </div>
       

    </>
  )
}

export default WorkExperienceBlock