import React, { useState } from 'react';
import Cover from '../../Shared/Cover/Cover';
import bannerImg from "../../../assets/shop/banner2.jpg";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import useMenu from '../../../hooks/useMenu';
import FoodCart from '../../../Component/FoodCart/FoodCart';

const Order = () => {
  const [menu, loading] = useMenu();
  const [viewMode, setViewMode] = useState('grid');

  const dessert = menu.filter(item => item.category === "dessert");
  const pizza = menu.filter(item => item.category === "pizza");
  const salad = menu.filter(item => item.category === "salad");
  const soup = menu.filter(item => item.category === "soup");
  const offered = menu.filter(item => item.category === "offered");
  const drinks = menu.filter(item => item.category === "drinks");

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <Cover
        title="Our Shop"
        subtitle="Explore our wide variety of delicious food options"
        img={bannerImg}
        height="400px"
      />

      <div className='container lg:mx-auto mx-4'>
        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`mr-2 px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            List View
          </button>
        </div>

        <Tabs>
          <TabList className="flex flex-wrap justify-center mb-8 bg-gray-100 p-1 rounded-full space-x-2 md:space-x-4">
            <Tab
              className="react-tabs__tab px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 font-medium text-gray-600 hover:bg-primary/10 hover:text-primary 
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-black"
            >
              Dessert
            </Tab>
            <Tab
              className="react-tabs__tab px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 font-medium text-gray-600 hover:bg-primary/10 hover:text-primary 
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-black"
            >
              Pizza
            </Tab>
            <Tab
              className="react-tabs__tab px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 font-medium text-gray-600 hover:bg-primary/10 hover:text-primary 
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-black"
            >
              Soup
            </Tab>
            <Tab
              className="react-tabs__tab px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 font-medium text-gray-600 hover:bg-primary/10 hover:text-primary 
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-black"
            >
              Salad
            </Tab>
            <Tab
              className="react-tabs__tab px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 font-medium text-gray-600 hover:bg-primary/10 hover:text-primary 
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-black"
            >
              Offered
            </Tab>
            <Tab
              className="react-tabs__tab px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 font-medium text-gray-600 hover:bg-primary/10 hover:text-primary 
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-black"
            >
              Drinks
            </Tab>
          </TabList>

          <TabPanel>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {dessert.map(item => (
                <FoodCart
                  key={item._id}
                  item={item}
                  view={viewMode}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {pizza.map(item => (
                <FoodCart
                  key={item._id}
                  item={item}
                  view={viewMode}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {soup.map(item => (
                <FoodCart
                  key={item._id}
                  item={item}
                  view={viewMode}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {salad.map(item => (
                <FoodCart
                  key={item._id}
                  item={item}
                  view={viewMode}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {offered.map(item => (
                <FoodCart
                  key={item._id}
                  item={item}
                  view={viewMode}
                />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
              {drinks.map(item => (
                <FoodCart
                  key={item._id}
                  item={item}
                  view={viewMode}
                />
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Order;
