import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';

const CurrentMenu = () => {
  const { menu_image, menu_name } = useSelector(
    (state: RootState) => state.guide
  );
  return (
    <div className="w-full h-full flex flex-col rounded-lg overflow-hidden border-typo-4 border bg-white font-bold text-xl">
      <p className="flex-none  border-b border-typo-4 flex justify-center items-center px-2 py-2">
        <span>{menu_name}</span>
      </p>
      <div className="flex-1 relative">
        <img
          src={menu_image}
          className="absolute  px-4 py-2 w-full h-full left-0 top-0 object-contain"
        />
      </div>
    </div>
  );
};

export default CurrentMenu;
