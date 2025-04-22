import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useFetchMenu } from 'HookFarm/useMenu';
import InferenceForm from './InferenceForm';
import InferenceImage from './InferenceImage';

const InferenceListStyle = styled.div`
  width: 100%;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  h1 {
    font-size: 2rem;
    font-weight: bold;
  }

  select {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    width: 100%;
    background-color: #0070f3;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      background-color: #0051a2;
    }
  }

  h2,
  h3 {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .result {
    flex: 0.5;
  }
`;

interface Props {
  menuIdx: number;
}

const InferenceList = ({ menuIdx }: Props) => {
  const { data, isLoading } = useFetchMenu(menuIdx);
  const [doughImage, setDoughImage] = useState<File | null>(null);

  if (!data || isLoading)
    return <InferenceListStyle>Loading...</InferenceListStyle>;

  return (
    <InferenceListStyle>
      <div className="common">
        <h3>Dough Image 입력</h3>
        <InferenceImage
          label="Dough Image를 입력해주세요."
          onChange={setDoughImage}
        />
      </div>
      {data.attributes.topping_steps
        .filter(
          step =>
            !step.is_after_topping &&
            step.task !== 'pass' &&
            step.ai_step_code !== '26'
        )
        .map(step => (
          <InferenceForm key={step.id} step={step} doughImage={doughImage} />
        ))}
    </InferenceListStyle>
  );
};

export default InferenceList;
