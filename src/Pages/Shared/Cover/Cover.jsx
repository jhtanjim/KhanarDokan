import React from 'react';

const Cover = ({ title, subtitle, img, height = "500px" }) => {
  return (
    <div className="mb-8">
      <div 
        className="relative w-full"
        style={{ 
          height,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-4xl font-bold mb-2">
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg max-w-lg">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cover;