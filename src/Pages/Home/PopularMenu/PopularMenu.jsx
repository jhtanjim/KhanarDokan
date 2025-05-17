import SectionTitle from '../../../Component/SectionTitle/SectionTitle';
import MenuItem from '../../Shared/MenuItem/MenuItem';
import useMenu from '../../../hooks/useMenu';

const PopularMenu = () => {
    const [menu,loading]=useMenu()
    if(loading){
      return <p className="text-center text-gray-500">Loading...</p>; // Show a loader while fetching
    }
    const popularItems = menu.filter(item => item.category === "popular");
  return (
    <div>
      <SectionTitle
        heading={"Our Popular Menu"}
        subHeading={"Explore our selection of the most popular dishes!"}
      />

      <div className=' max-w-screen-xl mx-4 lg:mx-auto grid lg:grid-cols-3 gap-4'>{

popularItems.length>0 ?(
  popularItems.map(item=><MenuItem
  key={item._id}
  item={item}
  ></MenuItem>)
):( <p className="text-center text-gray-500 col-span-3">No popular items available.</p>
)



}</div>
    </div>
  );
};

export default PopularMenu;
