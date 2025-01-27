import React from 'react'
import emptyPlate from '../assets/images/emptyPlate.svg';
import './Css/NoPage.css';


const NoPage = () => {
  return (
<div>
  <section className="flex items-center h-full sm:p-16 bg-white">
    <div className="flex flex-col items-center justify-center px-5 mx-auto my-8 space-y-8 text-center sm:max-w-md">
    <img src={emptyPlate} class="w-full h-full max-md:w-4/5 mx-auto block object-cover pt-20 jump-animation" alt="Empty Plate" />
      <p className="text-4xl font-semibold md:text-4xl whitespace-nowrap">Sorry, we couldn't find this page.</p>
      <p className="mt-4 mb-8 dark:text-gray-600 md:text-1xl whitespace-nowrap">But dont worry, you can find plenty of other things on our homepage.</p>
      <a rel="noopener noreferrer" href="/login" className="px-8 py-3 font-semibold rounded bg-[#32de84] hover:bg-[#2dc978] dark:text-gray-50">Back to homepage</a>
    </div>
  </section>
</div>  
  )
}

export default NoPage