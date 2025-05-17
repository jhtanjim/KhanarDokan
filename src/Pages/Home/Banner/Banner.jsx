import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel CSS
import { Carousel } from 'react-responsive-carousel';
import img1 from"../../../assets/home/01.jpg"
import img2 from"../../../assets/home/02.jpg"
import img3 from"../../../assets/home/03.png"
import img4 from"../../../assets/home/04.jpg"
const Banner = () => {
  return (
    <div className=" bg-black mb-6">
      <Carousel 
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showIndicators={true}
        interval={3000} // 3 seconds per slide
      >
        <div>
          <img  src={img1} alt="Slide 1" className="rounded-lg opacity-100 shadow-md" />
         
        </div>
        <div>
          <img  src={img2} alt="Slide 2" className="rounded-lg opacity-100 shadow-md" />
       
        </div>
        <div>
          <img  src={img3} alt="Slide 3" className="rounded-lg opacity-100 shadow-md" />
        
        </div>
        <div>
          <img  src={img4} alt="Slide 3" className="rounded-lg opacity-100 shadow-md" />
        
        </div>
      </Carousel>
    </div>
  );
};

export default Banner;
