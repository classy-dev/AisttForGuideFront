import axios, { AxiosError } from 'axios';
import { GuideDirection } from 'HookFarm/useAisttSocketEvents';

export const guideApi = axios.create({
  timeout: 5000,
});

interface IGuideStartData {
  is_ready: boolean;
  is_used: boolean;
}

interface IProcessData {
  alert?: string;
  current_step: number;
  progress_dec: number;
  progress_seg: number;
  natural_width: number;
  natural_height: number;
  current_weight: number;
  topping_boxes: [x1: number, x2: number, y1: number, y2: number][];
}

export const ping = async () => {
  try {
    const response = await guideApi.get<null>('/ping');

    if (response.status === 200 || response.status === 404) return true;
    return false;
  } catch (error) {
    const { response } = error as AxiosError;

    return response?.status === 404;
  }
};

export const guideStart = (params: {
  direction: GuideDirection;
  menu_idx: number;
}) => {
  return guideApi.get<IGuideStartData>(`/GUIDE_START`, {
    params,
  });
};

export const guideProcess = (params: {
  direction: GuideDirection;
  current_step: number;
}) => {
  return guideApi.get<IProcessData>(`/PROCESS`, {
    params,
  });
};

export const guideColorMap = async (params: {
  direction: GuideDirection;
  current_step: number;
}) => {
  const res = await guideApi.get<Blob>(`/COLORMAP`, {
    params,
    responseType: 'blob',
  });

  return res.data;
};

export const guideImage = async (params: {
  direction: GuideDirection;
  current_step: number;
}) => {
  const response = await guideApi.get<Blob>(`/IMAGE`, {
    params,
    responseType: 'blob',
  });

  return response.data;
};

export const guideEnd = (direction: GuideDirection) => {
  return guideApi.get<null>(`/GUIDE_END`, {
    params: {
      direction,
    },
  });
};

export const guideExit = (direction: GuideDirection) => {
  return guideApi.get<null>(`/EXIT`, {
    params: {
      direction,
    },
  });
};

export const fetchKeyFrame = async (
  direction: GuideDirection,
  current_step: number
) => {
  const [image, colorImage] = await Promise.all([
    guideImage({
      direction,
      current_step,
    }),
    guideColorMap({
      direction,
      current_step,
    }),
  ]);

  return {
    image,
    colorImage,
  };
};

export const fetchMockupKeyframe = async () => {
  const requestImage = (url: string) =>
    axios
      .get(url, {
        responseType: 'blob',
      })
      .then(res => res.data);

  const [image, colorImage] = await Promise.all([
    requestImage('/mockup/image.png'),
    requestImage('/mockup/colormap.png'),
  ]);

  return {
    image,
    colorImage,
  };
};
