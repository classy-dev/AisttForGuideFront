import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import { IMenu } from 'InterfaceFarm/menu';

const RecipeToppingStepStyle = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e5e5;
  border-radius: 0.6rem;
  overflow: hidden;

  .note {
    margin-left: 0.4rem;
  }

  h3 {
    background-color: #eef4ff;
    padding: 1rem 2.4rem;
    font-weight: bold;
    margin-bottom: 0.6rem;
    color: #2264e5;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
  }

  section {
    position: relative;
    padding-bottom: 1.2rem;
  }

  section:first-of-type h3 {
    border-top: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.6rem;
    padding: 0.2rem 2.4rem;
  }

  li + li {
    margin-top: 0.8rem;
  }

  .topping-value {
    font-weight: normal;
    color: #969492;
  }
`;

interface Props {
  steps: IMenu['topping_steps'];
}

const RecipeToppingSteps = ({ steps }: Props) => {
  const isDev = useSelector(
    (state: RootState) => state.preference.isDev === '1'
  );
  const baseToppingSteps = React.useMemo(
    () => steps.filter(item => !item.is_after_topping),
    [steps]
  );

  const afterToppingSteps = React.useMemo(
    () => steps.filter(item => !!item.is_after_topping),
    [steps]
  );

  return (
    <RecipeToppingStepStyle>
      <div className="absolute w-full h-full flex flex-col overflow-auto">
        <section>
          <h3>기본 토핑</h3>
          <ul>
            {baseToppingSteps.map((step, i) => (
              <li key={step.id} className="flex justify-between">
                <span className="topping-name">
                  {step.ingredient?.data?.attributes.ingredient_name}
                </span>
                <span className="topping-value">
                  {`${step.quantity ?? ''}${
                    step.ingredient?.data?.attributes.ingredient_unit ?? ''
                  }`}
                  {step.details && (
                    <span className="note">
                      ({step.details.replace(/\(|\)/g, '') ?? ''})
                    </span>
                  )}
                  {isDev && <span>[W: {step.required_value}]</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
        {afterToppingSteps.length > 0 && (
          <section>
            <h3>후토핑</h3>
            <ul>
              {afterToppingSteps.map((step, i) => (
                <li key={step.id}>
                  <span className="topping-name">
                    {step.ingredient?.data?.attributes.ingredient_name}{' '}
                  </span>
                  <span className="topping-value">
                    {`${step.quantity ?? ''}${step.ingredient?.data?.attributes
                      .ingredient_unit}`}

                    {step.details && (
                      <span className="note">
                        ({step.details.replace(/\(|\)/g, '') ?? ''})
                      </span>
                    )}

                    {isDev && <span>[W: {step.required_value}]</span>}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </RecipeToppingStepStyle>
  );
};

export default RecipeToppingSteps;
