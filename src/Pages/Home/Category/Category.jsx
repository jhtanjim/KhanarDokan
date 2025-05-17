import React from 'react';
import SectionTitle from '../../../Component/SectionTitle/SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from "../../../assets/home/slide1.jpg";
import img2 from "../../../assets/home/slide2.jpg";
import img3 from "../../../assets/home/slide3.jpg";
import img4 from "../../../assets/home/slide4.jpg";
import img5 from "../../../assets/home/slide5.jpg";

const images = [
  { src: img1, title: "Salad" },
  { src: img2, title: "Soups" },
  { src: img3, title: "Pizzas" },
  { src: img4, title: "Dessert" },
  { src: img5, title: "Category 5" },
];

const CategoryCard = ({ img }) => (
  <div className="flex flex-col items-center">
    <img
      className="w-32 h-32 rounded-full object-cover shadow-md hover:scale-105 transition duration-300"
      src={img.src}
      alt={img.title}
    />
    <p className="mt-2 text-center text-lg font-semibold text-primary">{img.title}</p>
  </div>
);

const Category = () => {
  return (
    <div className="my-12">
      <SectionTitle
        heading={"Explore our menu"}
        subheading={"Explore our menu Choose from a diverse menu featuring a delectable array of dishes. Our mission cravings and elevate your dining experience one delicious meal at a time"}
      />
      
      {/* Mobile View - with Swiper */}
      <div className="mt-8 px-4 md:px-8 lg:hidden">
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            }
          }}
          className="mySwiper"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <CategoryCard img={img} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
      {/* Desktop View - Regular Grid */}
      <div className="hidden lg:flex justify-center gap-12 mt-8 px-4 md:px-8">
        {images.map((img, index) => (
          <CategoryCard key={index} img={img} />
        ))}
      </div>
    </div>
  );
};

export default Category;