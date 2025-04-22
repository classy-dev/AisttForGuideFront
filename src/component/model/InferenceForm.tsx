import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { fetchInferenceColormap, fetchInferenceData } from 'ApiFarm/inference';
import { IMenu } from 'InterfaceFarm/menu';
import GuideImage from 'ComponentFarm/visual/GuideImage';
import SegmentationView from 'ComponentFarm/visual/SegmentationView';
import { DoughRect } from 'UtilFarm/visual/image';
import InferenceImage from './InferenceImage';

const InferenceFormWrapper = styled.div`
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid grey;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;

  .form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .result {
    flex: 1;
    display: flex;
    gap: 0.5rem;
  }

  .result > * {
    max-width: 640px;
    width: 100%;
    border: 1px solid grey;
  }

  .result img {
    max-width: 640px;
  }

  .result .progress {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3.2rem;
    font-weight: bold;
    color: blue;
    text-align: center;

    span {
      font-size: 0.9em;
      font-weight: 600;
    }

    & > * {
      flex: none;
    }
  }

  .fragment-progress {
    position: relative;
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
`;

interface Props {
  step: IMenu['topping_steps'][number];
  doughImage: File | null;
}

interface IFormData {
  current_step: string;
  topping_image: File | null;
  dough_image: File | null;
}

const InferenceForm = ({ step, doughImage }: Props) => {
  const [inferenceObject, setInferenceObject] = useState<any>(null);
  const [doughRect, setDoughRect] = useState<DoughRect | null>(null);
  const [colorImageData, setColorImageData] = useState<ImageData | null>(null);

  const { handleSubmit, register, setValue } = useForm<IFormData>({
    defaultValues: {
      current_step: step.ai_step_code,
      topping_image: null,
      dough_image: null,
    },
  });

  useEffect(() => {
    setValue('dough_image', doughImage);
  }, [doughImage]);

  const submit = async (data: IFormData) => {
    if (!data.dough_image || !data.topping_image || !doughRect) {
      return alert('도우 이미지와 토핑 이미지를 입력해주세요.');
    }

    const dough_image = data.dough_image;
    const topping_image = data.topping_image;
    const params = {
      current_step: data.current_step,
      dough_image,
      topping_image,
      doughRect,
    };

    const [inferenceResponse, colorImageData] = await Promise.all([
      fetchInferenceData(params),
      fetchInferenceColormap(params),
    ]);

    setInferenceObject(inferenceResponse);
    setColorImageData(colorImageData);
  };

  return (
    <InferenceFormWrapper>
      <form className="form" onSubmit={handleSubmit(submit)}>
        <input type="hidden" {...register('current_step')} />
        <InferenceImage
          label="Topping Image를 입력해주세요."
          onChange={file => setValue('topping_image', file)}
        />

        <button>전송하기</button>
      </form>
      <div className="result">
        <div className="progress">
          <span>모델 Inference Value</span>{' '}
          {((inferenceObject?.progress_seg ?? 0) * 100).toFixed(4)}
          <br />
          Count: {inferenceObject?.progress_dec}
        </div>
        <div className="fragment-progress">
          <GuideImage
            src={step.gt_image}
            toppingArea={step.topping_area}
            onLoad={rect => setDoughRect(rect)}
          />
          {colorImageData && doughRect && (
            <SegmentationView
              top={doughRect.top ?? 0}
              left={doughRect.left ?? 0}
              width={doughRect.width ?? 0}
              height={doughRect.height ?? 0}
              baseImageData={doughRect.imageData}
              colorImageData={colorImageData}
            />
          )}
        </div>
      </div>
    </InferenceFormWrapper>
  );
};

export default InferenceForm;
