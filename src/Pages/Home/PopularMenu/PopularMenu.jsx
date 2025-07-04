import SectionTitle from "../../../Component/SectionTitle/SectionTitle";
import useMenu from "../../../hooks/useMenu";
import MenuItem from "../../Shared/MenuItem/MenuItem";

const LatestMenu = () => {
  const [menu, loading] = useMenu();

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  // Get latest 6 items based on createdAt
  const latestItems = [...menu]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div>
      <SectionTitle
        heading="Latest Menu Items"
        subHeading="Check out our newest dishes!"
      />

      <div className="max-w-screen-xl mx-4 lg:mx-auto grid lg:grid-cols-3 gap-4">
        {latestItems.length > 0 ? (
          latestItems.map((item) => <MenuItem key={item._id} item={item} />)
        ) : (
          <p className="text-center text-gray-500 col-span-3">
            No latest items available.
          </p>
        )}
      </div>
    </div>
  );
};

export default LatestMenu;
