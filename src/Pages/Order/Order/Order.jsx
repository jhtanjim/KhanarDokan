import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import bannerImg from "../../../assets/shop/banner2.jpg";
import FoodCart from "../../../Component/FoodCart/FoodCart";
import useMenu from "../../../hooks/useMenu";
import Cover from "../../Shared/Cover/Cover";

const Order = () => {
  const [menu, loading] = useMenu();
  const [viewMode, setViewMode] = useState("grid");

  const dessert = menu.filter((item) => item.category === "dessert");
  const pizza = menu.filter((item) => item.category === "pizza");
  const salad = menu.filter((item) => item.category === "salad");
  const soup = menu.filter((item) => item.category === "soup");
  const mainCourse = menu.filter((item) => item.category === "main-course");
  const drinks = menu.filter((item) => item.category === "beverage");
  const snacks = menu.filter((item) => item.category === "snack");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Cover
        title="Our Shop"
        subtitle="Explore our wide variety of delicious food options"
        img={bannerImg}
        height="300px sm:400px md:500px"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* View Toggle - Responsive */}
        <div className="flex justify-center sm:justify-end mb-6 sm:mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-primary hover:bg-white"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none px-4 py-2 sm:px-6 sm:py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-primary hover:bg-white"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        <Tabs>
          {/* Responsive Tab List */}
          <TabList className="flex flex-wrap justify-center mb-6 sm:mb-8 bg-gray-50 p-2 sm:p-3 rounded-xl gap-2 sm:gap-3">
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Dessert
            </Tab>
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Pizza
            </Tab>
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Soup
            </Tab>
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Salad
            </Tab>
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Main Course
            </Tab>
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Drinks
            </Tab>
            <Tab
              className="react-tabs__tab px-3 py-2 sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-lg cursor-pointer transition-all duration-300 font-medium text-sm sm:text-base text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent
              react-tabs__tab--selected:bg-primary react-tabs__tab--selected:text-white react-tabs__tab--selected:border-primary react-tabs__tab--selected:shadow-sm"
            >
              Snacks
            </Tab>
          </TabList>

          {/* Tab Panels with Responsive Grids */}
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {dessert.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {pizza.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {soup.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {salad.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {mainCourse.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {drinks.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div
              className={`grid ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "grid-cols-1 gap-4"
              }`}
            >
              {snacks.map((item) => (
                <FoodCart key={item._id} item={item} view={viewMode} />
              ))}
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
};

export default Order;
