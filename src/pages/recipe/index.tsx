import { Navigate, Outlet, useParams } from 'react-router-dom';
import RecipeMenuList from 'Root/src/component/recipe/RecipeMenuList';

const Recipe = () => {
  const { direction } = useParams<{ direction: string }>();

  if (direction !== 'left' && direction !== 'right') {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-row w-full h-full">
      <RecipeMenuList />
      <Outlet />
    </div>
  );
};

export default Recipe;
