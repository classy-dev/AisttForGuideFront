import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import StrapiImage from 'ComponentFarm/strapi/Image';

const CurrentToppingWrapper = styled.div`
  width: 100%;
  height: 18rem;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 0.8rem;

  .topping-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0;
  }

  .topping-info {
    margin-top: 1.6rem;
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 700;
    text-align: center;
  }

  .topping-area {
    position: relative;
    flex: 1;
    margin-bottom: 1.6rem;
  }

  .weight {
    display: flex;
    justify-content: space-between;
    font-size: 1.6rem;
    padding: 1rem 0.8rem;
  }
`;

const CurrentTopping = () => {
  const isWeight = useSelector(
    (state: RootState) => state.preference.isWeight === '1'
  );

  const isDev = useSelector(
    (state: RootState) => state.preference.isDev === '1'
  );
  const currentToppingValue = useSelector(
    (state: RootState) => state.guide.currentProgress
  );

  const currentTopping = useSelector(
    (state: RootState) => state.guide.topping_steps[state.guide.currentStep]
  );

  const currentWeight = useSelector(
    (state: RootState) => state.guide.currentWeight
  );

  if (!currentTopping) return null;

  return (
    <CurrentToppingWrapper className="w-full flex flex-col rounded-lg overflow-hidden border-typo-4 border bg-white font-bold text-xl ">
      <p className="topping-info">
        <span>
          {currentTopping?.ingredient?.data?.attributes.ingredient_name}
        </span>
      </p>
      <div className="topping-area">
        {currentTopping?.ingredient?.data.attributes.ingredient_image && (
          <StrapiImage
            className="topping-image"
            alt={currentTopping?.ingredient?.data.attributes.ingredient_name}
            image={
              currentTopping?.ingredient?.data.attributes.ingredient_image.data
                .attributes
            }
          />
        )}
      </div>
      {isDev && (
        <p className="weight">
          <span>현재: {currentToppingValue?.toFixed(1)}</span>
          <span>임계값: {currentTopping.required_value}</span>
        </p>
      )}
      {isWeight && (
        <p className="weight">
          <span>Require: {currentTopping?.quantity}</span>
          <span>Current: {currentWeight?.toFixed(1)}</span>
        </p>
      )}
    </CurrentToppingWrapper>
  );
};

export default CurrentTopping;
