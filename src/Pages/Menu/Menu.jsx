import React from "react";
import { Helmet } from "react-helmet-async";
import Cover from "../Shared/Cover/Cover";
import coverImg from "../../assets/menu/banner3.jpg"
import useMenu from "../../hooks/useMenu";
import MenuCategory from "../Shared/MenuCategory/MenuCategory";
import imgdessert from "../../assets/menu/dessert.jpeg"
import imgPizza from "../../assets/menu/pizza-bg.jpg"
import imgsalad from "../../assets/menu/salad-bg.jpg"
import imgsoup from "../../assets/menu/soup-bg.jpg"
import imgdrinks from "../../assets/menu/drinks.jpg"
const Menu = () => {
  const [menu,loading]=useMenu()
const dessert=menu.filter(item=>item.category==="dessert")
const pizza=menu.filter(item=>item.category==="pizza")
const salad=menu.filter(item=>item.category==="salad")
const soup=menu.filter(item=>item.category==="soup")
const offered=menu.filter(item=>item.category==="offered")
const drinks=menu.filter(item=>item.category==="drinks")
  if(loading){
    return <p className="text-center text-gray-500">Loading...</p>; // Show a loader while fetching
  }
  return (
    <div>
      <Helmet>
        <title>Khanar Dokan | Our Menu</title>
      </Helmet>
      <Cover 
        title="Our Menu" 
        subtitle="Explore our wide variety of delicious food options" 
        img={coverImg} 
        height="400px"
      />
      {/* ?main cover */}
     
      {/* ofered */}
<MenuCategory
items={offered}
></MenuCategory>  

{/* pizza */}
<MenuCategory
items={pizza}
title={"Pizza"}
img={imgPizza}
>
  
</MenuCategory>
{/* soup */}
<MenuCategory
items={soup}
title={"Soup"}
img={imgsoup}
>
  
</MenuCategory>
{/* salad */}
<MenuCategory
items={salad}
title={"salad"}
img={imgsalad}
>
  
</MenuCategory>
{/* dessert */}
<MenuCategory
items={dessert}
title={"dessert"}
img={imgdessert}
>
  
</MenuCategory>
{/* drinks */}
<MenuCategory
items={drinks}
title={"drinks"}
img={imgdrinks}
>
  
</MenuCategory>

    </div>
  );
};

export default Menu;
