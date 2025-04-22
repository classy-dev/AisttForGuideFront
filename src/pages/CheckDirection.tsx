import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { RootState } from 'StoreFarm/reducer';

const CheckDirection = () => {
  const navigate = useNavigate();
  const { direction } = useParams<{ direction: string }>();
  const preference = useSelector((state: RootState) => state.preference);

  useEffect(() => {
    if (direction !== preference.direction) {
      navigate(`/${preference.direction}`);
    }
  }, [direction, preference]);

  return <Outlet />;
};

export default CheckDirection;
