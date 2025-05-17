import React from 'react'
import Banner from '../Banner/Banner'
import Category from '../Category/Category'
import PopularMenu from '../PopularMenu/PopularMenu'
import Testimonial from '../Testimonial/Testimonial'
import { Helmet } from 'react-helmet'

const Home = () => {
  return (
    <div>
        <Helmet>
               <title>Khanar Dokan | Home</title>
             </Helmet>
     <Banner/>
     <Category/>
     <PopularMenu/>
     <Testimonial/>
    </div>
  )
}

export default Home
