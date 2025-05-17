import React from 'react';

const MenuItem = ({ item }) => {
  const { name, recipe, image, category, price } = item;
  
  return (
    <div className="relative  mx-auto bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
      {/* Badge for popular item */}
      <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase z-10">
        Popular
      </div>
      
      {/* Food Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white px-3 py-1 uppercase text-xs tracking-wider">
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{recipe}</p>
        
        {/* Action buttons */}
        <div className="flex justify-between items-center mt-4">
          <button className="bg-primary hover:bg-primary text-white py-2 px-4 rounded-full text-sm font-medium transition duration-300">
            Add to Cart
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;