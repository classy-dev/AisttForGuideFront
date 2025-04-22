/* eslint-disable no-loss-of-precision */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMenu } from 'InterfaceFarm/menu';
import { mergeGroupTopping } from 'UtilFarm/menu';

export interface IGuideInfoState
  extends Pick<IMenu, 'menu_name' | 'topping_steps'> {
  ai_menu_code: string;
  menu_image: string;
  currentProgress: number;
  currentStep: number;
  currentWeight: number;
  fragmentComplete: boolean;
  stepProgresses: number[];
  avgProgresses: number[];
  colorMap: string;
  isStart: boolean;
  isEnd: boolean;
  isPending: boolean;
  processCount: number;
  minimumProgress: number;
  topping_boxes?: [x1: number, y1: number, x2: number, y2: number][];
}

const initialState: IGuideInfoState = {
  ai_menu_code: '',
  menu_image: '',
  menu_name: '',
  isStart: false,
  isEnd: false,
  isPending: false,
  fragmentComplete: false,
  colorMap: '',
  topping_steps: [],
  currentProgress: 0,
  currentStep: 0,
  currentWeight: 0,
  processCount: 0,
  minimumProgress: 0,
  stepProgresses: [],
  avgProgresses: [],
  topping_boxes: [],
};

const maxAvgProgress = 4;

const guideSlice = createSlice({
  name: 'guide',
  initialState,
  reducers: {
    setMenuData(state, action: PayloadAction<IMenu>) {
      const menu = action.payload;

      return {
        ...menu,
        ai_menu_code: menu.ai_menu_code,
        menu_image: menu.menu_image?.data?.attributes.url ?? '',
        topping_steps: mergeGroupTopping(menu.topping_steps).filter(
          step => step.task !== 'pass' && !step.is_after_topping
        ),
        currentProgress: 0,
        currentStep: 0,
        currentWeight: 0,
        processCount: 0,
        minimumProgress: 0,
        isStart: false,
        isEnd: false,
        isPending: false,
        fragmentComplete: false,
        colorMap: '',
        avgProgresses: [],
        stepProgresses: Array.from(
          { length: menu.topping_steps.length },
          () => 0
        ),
        topping_boxes: [],
      };
    },
    initialize() {
      return { ...initialState };
    },
    nextStep(state) {
      if (state.currentStep === state.topping_steps.length - 1) return;
      const { currentStep } = state;
      state.stepProgresses[currentStep] = state.currentProgress;
      state.currentStep += 1;
      state.currentProgress = 0;
      state.processCount = 0;
      state.minimumProgress = 0;
      state.topping_boxes = [];
      state.avgProgresses = [];
      state.fragmentComplete = false;
    },
    setFragmentComplete(state, action: PayloadAction<boolean>) {
      state.fragmentComplete = action.payload;
    },
    setMinimumProgress(state, action: PayloadAction<number>) {
      state.minimumProgress = action.payload;
    },
    setProgress(
      state,
      action: PayloadAction<{
        progress: number;
        topping_boxes: IGuideInfoState['topping_boxes'];
      }>
    ) {
      if (state.processCount <= 10) {
        state.processCount += 1;
        return;
      }

      const progress = action.payload.progress;

      if (state.avgProgresses.length >= maxAvgProgress) {
        state.avgProgresses.shift();
        state.avgProgresses.push(progress);
      } else {
        state.avgProgresses.push(progress);
      }

      const avgProgress =
        state.avgProgresses.reduce((acc, cur) => acc + cur, 0) / maxAvgProgress;

      // task가 segmentation 일시 이전 progress보다 아래로 내려가는것을 방지
      if (state.topping_steps[state.currentStep]?.task === 'segmentation') {
        state.currentProgress = Math.max(avgProgress, state.minimumProgress, 0);
        state.minimumProgress = state.currentProgress;
      } else {
        // task가 detection일시 minimumProgress 아래로 내려갈 수 없음.
        state.currentProgress = Math.max(progress, state.minimumProgress, 0);
      }

      state.topping_boxes = action.payload.topping_boxes?.map(box => [
        // box좌표 스케일 보정: XGO에 맞춤 추후에 원본 스케일 받아서 수정해야함
        box[0] * 0.9,
        box[1] * 0.87,
        box[2] * 0.9,
        box[3] * 0.87,
      ]);

      // state.topping_boxes = [
      //   [
      //     97.72525787353516, 294.45233154296875, 232.7810516357422,
      //     420.9410400390625,
      //   ],
      //   [
      //     505.4457092285156, 298.2489318847656, 640.1251220703125,
      //     429.5795593261719,
      //   ],
      //   [
      //     361.8089904785156, 12.356446266174316, 491.35845947265625,
      //     129.76992797851562,
      //   ],
      //   [376.97259521484375, 306.11212158203125, 507.9344482421875, 439.703125],
      //   [
      //     42.146034240722656, 88.81443786621094, 166.33688354492188,
      //     223.85130310058594,
      //   ],
      //   [
      //     487.6654968261719, 21.130741119384766, 614.4035034179688,
      //     146.55429077148438,
      //   ],
      //   [
      //     252.81126403808594, 312.5692443847656, 380.7821960449219,
      //     437.85723876953125,
      //   ],
      //   [
      //     172.85995483398438, 168.92843627929688, 308.8296813964844,
      //     286.8654479980469,
      //   ],
      //   [
      //     551.1203002929688, 146.87802124023438, 683.458740234375,
      //     265.80426025390625,
      //   ],
      //   [
      //     325.2088623046875, 170.4976043701172, 451.6892395019531,
      //     290.4931640625,
      //   ],
      //   [
      //     438.5032958984375, 161.27113342285156, 561.3005981445312,
      //     278.59539794921875,
      //   ],
      //   [
      //     222.15338134765625, 19.43686866760254, 349.5225524902344,
      //     140.30633544921875,
      //   ],
      //   [
      //     36.55187225341797, 287.18142700195312, 161.98814392089844,
      //     387.74957275390625,
      //   ],
      // ].map(box => [
      //   // box좌표 스케일 보정: XGO에 맞춤 추후에 원본 스케일 받아서 수정해야함
      //   box[0] * 0.9,
      //   box[1] * 0.87,
      //   box[2] * 0.9,
      //   box[3] * 0.87,
      // ]);

      // console.log(state.topping_boxes);
      //오리지널 페퍼로니 13개 좌표
      // state.topping_boxes = [
      //   [500, 22, 631, 135],
      //   [500, 72, 631, 185],
      //   [111, 16, 247, 129],
      //   [248, 5, 375, 133],
      //   [573, 146, 706, 270],
      //   [26, 147, 160, 271],
      //   [300, 154, 429, 286],
      //   [434, 159, 564, 290],
      //   [160, 157, 297, 283],
      //   [374, 3, 508, 132],
      //   [228, 295, 364, 427],
      //   [358, 299, 496, 429],
      //   [494, 293, 633, 424],
      //   [95, 273, 234, 408],
      // ];

      // state.topping_boxes = [
      // [10, 20, 50, 60],
      // [30, 40, 70, 80],
      // [40, 50, 85, 95],
      // [45, 55, 85, 95],
      // [45, 75, 85, 115],
      // ];

      // 매니악 페퍼로니 18개 좌표
      // state.topping_boxes = [
      //   [46, 213, 176, 317],
      //   [40, 152, 172, 277],
      //   [503, 21, 633, 135],
      //   [440, 228, 572, 340],
      //   [582, 223, 709, 340],
      //   [183, 219, 320, 330],
      //   [438, 119, 561, 244],
      //   [312, 226, 444, 343],
      //   [112, 11, 246, 133],
      //   [563, 110, 695, 235],
      //   [248, 3, 377, 132],
      //   [169, 114, 302, 240],
      //   [376, 4, 511, 132],
      //   [313, 113, 448, 240],
      //   [229, 307, 366, 435],
      //   [498, 299, 636, 430],
      //   [98, 284, 236, 415],
      //   [364, 309, 503, 440],
      // ];

      // 배터바이트 10개 좌표
      // state.topping_boxes = [
      //   [151, 339, 213, 374],
      //   [66, 207, 125, 249],
      //   [309, 83, 366, 142],
      //   [472, 79, 539, 138],
      //   [156, 71, 225, 134],
      //   [514, 321, 586, 383],
      //   [416, 184, 498, 242],
      //   [231, 186, 300, 256],
      //   [320, 321, 394, 388],
      //   [594, 173, 663, 249],
      // ];

      //베이컨 10개 좌표
      // state.topping_boxes = [
      //   [154, 43, 232, 137],
      //   [330, 44, 410, 150],
      //   [313, 295, 400, 399],
      //   [67, 147, 153, 264],
      //   [458, 37, 554, 141],
      //   [127, 304, 237, 404],
      //   [509, 285, 603, 405],
      //   [565, 138, 670, 250],
      //   [377, 161, 488, 279],
      //   [186, 164, 305, 284],
      // ];
      // state.topping_boxes = [
      //   [425, 308, 483, 424],
      //   [87, 30, 159, 133],
      //   [231, 174, 309, 273],
      //   [515, 168, 581, 287],
      //   [354, 177, 429, 285],
      //   [236, 318, 313, 425],
      //   [407, 13, 484, 123],
      //   [96, 139, 180, 266],
      //   [218, 0, 307, 124],
      //   [54, 260, 165, 377],
      // ];

      // state.topping_boxes = [
      //   [509, 12, 628, 120],
      //   [147, 108, 275, 223],
      //   [421, 225, 556, 337],
      //   [393, 6, 527, 118],
      //   [257, 0, 394, 115],
      //   [566, 215, 705, 329],
      //   [349, 326, 481, 448],
      //   [289, 99, 418, 223],
      //   [548, 99, 679, 222],
      //   [128, 2, 258, 126],
      //   [10, 86, 149, 208],
      //   [489, 319, 623, 448],
      //   [148, 211, 283, 339],
      //   [208, 316, 340, 448],
      //   [282, 217, 415, 348],
      //   [8, 202, 143, 333],
      //   [414, 115, 557, 241],
      //   [66, 318, 206, 453],
      // ];
    },
    setWeight(state, action: PayloadAction<number>) {
      state.currentWeight = action.payload;
    },
    setToppingBoxes(
      state,
      action: PayloadAction<IGuideInfoState['topping_boxes']>
    ) {
      state.topping_boxes = action.payload;
    },
    setColormap(state, action: PayloadAction<string>) {
      state.colorMap = action.payload;
    },
    start(state) {
      state.isStart = true;
      state.isPending = false;
      state.processCount = 0;
      state.minimumProgress = 0;
    },
    complete(state) {
      const { currentStep } = state;
      state.stepProgresses[currentStep] = state.currentProgress;
      state.isStart = false;
      state.isEnd = true;
    },
    setPending(state, action: PayloadAction<boolean>) {
      state.isPending = action.payload;
    },
  },
});

export default guideSlice;
