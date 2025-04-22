import { IGuideInfoState } from 'SliceFarm/guide';
import styled from '@emotion/styled';

const ToppingStepStyle = styled.div`
  display: flex;
  width: 100%;
  align-items: stretch;
  justify-content: space-between;

  .left {
    flex: none;
    display: inline-flex;
    width: auto;
    align-items: center;
    padding: 1.2rem 2.4rem;
    background: #f9fafb;
    font-weight: 600;
    border-right: 2px solid #e5e5e5;
    border-bottom: 2px solid #e5e5e5;
    border-bottom-right-radius: 0.8rem;
    border-top-left-radius: 0.8rem;
  }

  .right {
    flex: none;
    display: inline-flex;
    width: auto;
    align-items: center;
    padding: 1.2rem 2.4rem;
    background: #f9fafb;
    font-weight: 600;
    border-left: 2px solid #e5e5e5;
    border-bottom: 2px solid #e5e5e5;
    border-bottom-left-radius: 0.8rem;
    border-top-right-radius: 0.8rem;
  }

  .current-number {
    width: 3.7rem;
    height: 3.7rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #2264e5;

    font-size: 2.4rem;
    border-radius: 50%;
    line-height: 1;
  }

  .topping-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-right: 2px solid #e5e5e5;
    padding-right: 1.6rem;
  }

  .total-number {
    font-size: 1.6rem;
    margin-left: 0.8rem;
    color: #2264e5;
  }

  .topping-name {
    min-width: 24rem;
    text-align: center;
    font-size: 2.4rem;
    padding-left: 1.6rem;
    font-weight: 700;
  }

  .topping-value {
    display: inline-flex;
    align-items: baseline;
    text-align: center;
    font-size: 2.2rem;
    font-weight: 700;
  }

  .topping-value-number {
    color: #2264e5;
  }

  .topping-unit {
    font-size: 2rem;
    font-weight: 600;
    padding-left: 0.3rem;
  }
  .note {
    padding-left: 0.6rem;
    font-size: 1.8rem;
  }
`;

interface Props {
  currentStep: number;
  toppingSteps: IGuideInfoState['topping_steps'];
  stepProgresses: IGuideInfoState['stepProgresses'];
}

export const ToppingSteps = ({ currentStep, toppingSteps }: Props) => {
  const step = toppingSteps[currentStep];

  return (
    <ToppingStepStyle className="flex-none">
      <div className="left">
        <div className="topping-number">
          <span className="current-number">{currentStep + 1}</span>
          <span className="total-number">/ {toppingSteps.length}</span>
        </div>
        <div className="topping-name">
          {toppingSteps[currentStep]?.ingredient?.data.attributes
            .ingredient_name ?? ''}
        </div>
      </div>

      <div className="right">
        <div className="topping-value">
          <span className="topping-value-number">{step?.quantity ?? ''}</span>
          <span className="topping-unit">
            {step?.ingredient?.data?.attributes.ingredient_unit ?? ''}
          </span>
          {step?.details && (
            <span className="note">
              ({step?.details.replace(/\(|\)/g, '') ?? ''})
            </span>
          )}
        </div>
      </div>
    </ToppingStepStyle>
  );
};
