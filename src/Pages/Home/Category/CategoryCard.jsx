import React from 'react';
import img1 from "../../../assets/home/slide1.jpg";
import img2 from "../../../assets/home/slide2.jpg";
import img3 from "../../../assets/home/slide3.jpg";
import img4 from "../../../assets/home/slide4.jpg";
import img5 from "../../../assets/home/slide5.jpg";

const images = [
  { src: img1, title: "Salad" },
  { src: img2, title: "Soups " },
  { src: img3, title: "Pizzas" },
  { src: img4, title: "Dessert" },
  { src: img5, title: "Category 5" },
];

const CategoryCard = () => {
  return (
    <div className="flex justify-center gap-12 p-6">
      {images.map((img, index) => (
        <div key={index} className="flex flex-col items-center">
          <img 
            className="w-32 h-32 rounded-full object-cover shadow-md hover:scale-105 transition duration-300" 
            src={img.src} 
            alt={img.title} 
          />
          <p className="mt-2 text-center text-lg font-semibold text-primary">{img.title}</p>
        </div>
      ))}
    </div>
  );
};

export default CategoryCard;
