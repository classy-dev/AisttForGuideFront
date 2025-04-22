import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import CheckDirection from 'PagesFarm/CheckDirection';
import HomeScreen from 'PagesFarm/HomeScreen';
import Recipe from 'PagesFarm/recipe';
import RecipeView from 'PagesFarm/recipe/RecipeView';
import RecipeEmptyView from 'Root/src/component/recipe/RecipeEmptyView';
import connectedSlice from 'SliceFarm/connected';
import { ping } from 'ApiFarm/guide';
import Layout from './Layout';

const Guide = React.lazy(() => import('PagesFarm/guide/Guide'));
const ModelTest = React.lazy(() => import('PagesFarm/ModelTest'));
const EditDetectPositions = React.lazy(
  () => import('PagesFarm/EditDetectPositions')
);

const Router = () => {
  const dispatch = useDispatch();

  /**
   * 서버 상태 체크
   */
  const guideServerHeathCheck = React.useCallback(async () => {
    const connected = await ping();

    dispatch(connectedSlice.actions.setIsConnected(connected));
  }, []);

  React.useEffect(() => {
    const timer = setInterval(guideServerHeathCheck, 2000);

    return () => clearInterval(timer);
  }, [guideServerHeathCheck]);

  return (
    <Suspense fallback={'...loading'}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/:direction" element={<CheckDirection />}>
            <Route path="" element={<Recipe />}>
              <Route index element={<RecipeEmptyView />} />
              <Route path=":menuId" element={<RecipeView />} />
            </Route>
            <Route path="guide/:menuId" element={<Guide />} />
          </Route>
          <Route path="/model-test" element={<ModelTest />} />
        </Route>
        <Route path="/editor" element={<EditDetectPositions />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
