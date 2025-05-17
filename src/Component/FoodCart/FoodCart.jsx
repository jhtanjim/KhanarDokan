import React, { useState } from 'react'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Flame, 
  Tag 
} from 'lucide-react'

const FoodCart = ({ item, view = 'grid' }) => {
    const { name, recipe, image, category, price } = item;
  
    // Grid View
    if (view === 'grid') {
        return (
            <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center z-20">
                    <Tag className="w-4 h-4 mr-1" />
                    {category}
                </div>
                
                {/* Favorite Button */}
                <button className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition-all duration-300">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 stroke-2" />
                </button>

                {/* Food Image */}
                <div className="relative h-56 w-full overflow-hidden">
                    <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover"
                    />
                </div>
                
                {/* Content */}
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                            <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="ml-1 text-sm text-gray-600">4.5</span>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-primary flex items-center">
                            <Flame className="w-5 h-5 mr-1 text-orange-500" />
                            ${price.toFixed(2)}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe}</p>
                    
                    {/* Permanent Add to Cart button */}
                    <div className="flex justify-between items-center mt-4">
                        <button className="flex items-center bg-primary text-white hover:bg-primary-dark py-2 px-4 rounded-full text-sm font-medium transition duration-300">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    // List View
    return (
        <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
            {/* Food Image */}
            <div className="w-1/3 h-64 relative overflow-hidden">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    {category}
                </div>
            </div>
            
            {/* Content */}
            <div className="w-2/3 p-6 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
                            <div className="flex items-center text-yellow-500 mt-1">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="ml-1 text-sm text-gray-600">4.5</span>
                            </div>
                        </div>
                        <span className="text-2xl font-bold text-primary flex items-center">
                            <Flame className="w-6 h-6 mr-1 text-orange-500" />
                            ${price.toFixed(2)}
                        </span>
                    </div>
                    
                    <p className="text-gray-600 text-base mb-4">{recipe}</p>
                </div>
                
                {/* Permanent Add to Cart button */}
                <div className="flex justify-between items-center">
                    <button className="flex items-center bg-primary text-white hover:bg-primary-dark py-3 px-6 rounded-full text-base font-medium transition duration-300">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}


export default FoodCart