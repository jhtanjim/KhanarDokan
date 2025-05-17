import React from 'react';

const SectionTitle = ({ heading, subheading }) => {
  return (
    <div className="text-center my-8">
      <h2 className="text-3xl font-bold text-black mb-2 uppercase">
        {heading}
      </h2>
      <div className="w-16 h-1 bg-primary mx-auto mb-3"></div>
      <p className="text-lg ">
        {subheading}
      </p>Choose from a diverse menu featuring a delectable array of dishes. Our mission
      cravings and elevate your dining experience, one delicious meal at a time.
    </div>
  );
};

export default SectionTitle;