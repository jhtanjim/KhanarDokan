import Cover from "../Cover/Cover";
import MenuItem from "../MenuItem/MenuItem";

const MenuCategory = ({ items, title, img }) => {
  return (
    <div>
      <div className="my-8">
        {title && (
          <Cover
            title={title}
            subtitle="Explore our wide variety of delicious food options"
            img={img}
            height="400px"
          />
        )}
      </div>
      <div className="p-4  container mx-auto grid lg:grid-cols-3 md:grid-cols-2  gap-4">
        {items.map((item) => (
          <MenuItem key={item._id} item={item}></MenuItem>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
