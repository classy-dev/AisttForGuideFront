import axios from 'axios';
import { DoughRect, getCompressedImageData } from 'UtilFarm/visual/image';

export const inferenceApi = axios.create({
  timeout: 5000,
});

export const fetchInferenceData = async (params: {
  current_step: string;
  dough_image: Blob | File;
  topping_image: Blob | File;
}) => {
  const formData = new FormData();
  formData.append('current_step', `${params.current_step}`);
  formData.append('dough_image', params.dough_image);
  formData.append('topping_image', params.topping_image);

  const res = await inferenceApi.post<{
    current_step: number;
    progress_seg: number;
    progress_dec: number;
    topping_boxes: number[];
  }>('/INFERENCE', formData);

  return res.data;
};

export const fetchInferenceColormap = async ({
  doughRect,
  ...params
}: {
  current_step: string;
  dough_image: Blob | File;
  topping_image: Blob | File;
  doughRect: DoughRect;
}) => {
  const formData = new FormData();
  formData.append('current_step', `${params.current_step}`);
  formData.append('dough_image', params.dough_image);
  formData.append('topping_image', params.topping_image);

  const res = await inferenceApi.post<Blob>('/INFERENCE_COLORMAP', formData, {
    responseType: 'blob',
  });

  const canvas = new OffscreenCanvas(doughRect.width, doughRect.height);
  const img = await createImageBitmap(res.data);

  const ctx = canvas.getContext('2d', {
    willReadFrequently: true,
  });

  if (!ctx) return null;

  ctx.clearRect(0, 0, 9999, 9999);
  ctx.drawImage(img, 0, 0, doughRect.width, doughRect.height);

  const imageData = ctx.getImageData(0, 0, doughRect.width, doughRect.height);
  const baseColor = [0, 0, 0, 255];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    if (r > 0 && g > 0 && b > 0 && a > 100) {
      imageData.data[i] = baseColor[0];
      imageData.data[i + 1] = baseColor[1];
      imageData.data[i + 2] = baseColor[2];
      imageData.data[i + 3] = baseColor[3];
    }

    if (r === 0 && g === 0 && b === 0) {
      imageData.data[i] = 0;
      imageData.data[i + 1] = 0;
      imageData.data[i + 2] = 0;
      imageData.data[i + 3] = 0;
    }
  }

  return getCompressedImageData(imageData, 1 / 3);
};
