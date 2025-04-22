import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import guideSlice from 'SliceFarm/guide';
import { useAppDispatch } from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import { PositionInfo } from 'InterfaceFarm/menu';
import { throttleEvent } from 'UtilFarm/event';
import {
  BoundingBox,
  calculateDistance,
  calculateRotatedBoxes,
  calculateScaleFactor,
} from 'UtilFarm/visual/boundingBox';
import DetectionObject from './DetectionObject';
import DevModeDetectionOverlay from './DevModeDetectionOverlay';

interface Props {
  left: number;
  top: number;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  positionInfo?: PositionInfo | null;
}

const DetectionRender = ({
  left,
  top,
  naturalWidth,
  naturalHeight,
  width,
  height,
  positionInfo,
}: Props) => {
  const dispatch = useAppDispatch();
  const isDev = useSelector(
    (state: RootState) => state.preference.isDev === '1'
  );
  const toppingBoxes = useSelector(
    (state: RootState) => state.guide.topping_boxes ?? []
  );

  const detectPositionInfo = useMemo(
    () => (positionInfo ? (positionInfo as PositionInfo) : null),
    [positionInfo]
  );

  const scaleFactors = useMemo(
    () => calculateScaleFactor(naturalWidth, naturalHeight, width, height),
    [naturalWidth, naturalHeight, width, height]
  );

  // left: 0, top: 0 에서 거리가 멀어진 순으로 정렬
  const rotatedBoxInfoList = useMemo(
    () =>
      calculateRotatedBoxes(
        toppingBoxes,
        scaleFactors,
        naturalWidth,
        naturalHeight
      ).sort(
        (a, b) =>
          calculateDistance([0, 0, 0, 0], a) -
          calculateDistance([0, 0, 0, 0], b)
      ),
    [toppingBoxes, scaleFactors, naturalWidth, naturalHeight]
  );

  const completeStatues = useMemo(
    () => detectPositionInfo?.positions.map(() => false) ?? [],
    [detectPositionInfo]
  );

  const adjacentBoxList = useMemo(() => {
    if (!detectPositionInfo) return [];
    const boxList = detectPositionInfo?.positions.map(() => -1) ?? [];

    rotatedBoxInfoList.forEach((box, i) => {
      let closestDistance = Infinity;
      let closestIndex = -1;
      let closestBBoxIndex = -1;

      detectPositionInfo?.positions.forEach((position, j) => {
        const positionBbox: BoundingBox = [
          position[0] -
            left * scaleFactors.imageScaleX -
            detectPositionInfo.width / 2,
          position[1] -
            top * scaleFactors.imageScaleY -
            detectPositionInfo.height / 2,
          position[0] -
            left * scaleFactors.imageScaleX -
            detectPositionInfo.width / 2 +
            detectPositionInfo.width,
          position[1] -
            top * scaleFactors.imageScaleY -
            detectPositionInfo.height / 2 +
            detectPositionInfo.height,
        ];

        const distance = calculateDistance(box, positionBbox);
        // 거리가 더 가깝고, 해당 위치가 아직 할당되지 않았으며, 현재 박스가 아직 할당되지 않았을 때만 업데이트
        if (distance < closestDistance && boxList[j] === -1) {
          closestDistance = distance;
          closestIndex = j;
          closestBBoxIndex = i;
        }
      });

      if (closestIndex !== -1) {
        boxList[closestIndex] = closestBBoxIndex;
      }
    });

    return boxList;
  }, [detectPositionInfo, scaleFactors, rotatedBoxInfoList]);

  const checkAllComplete = useCallback(
    throttleEvent(() => {
      const isAllComplete =
        completeStatues.length > 0 &&
        completeStatues.length ===
          completeStatues.filter(active => active).length;

      dispatch(guideSlice.actions.setFragmentComplete(isAllComplete));
    }, 500),
    [completeStatues]
  );

  const setMinimumProgress = useCallback(
    () =>
      dispatch(
        guideSlice.actions.setMinimumProgress(
          completeStatues.filter(active => active).length
        )
      ),
    [completeStatues]
  );

  const detectionObjects = useMemo(
    () =>
      detectPositionInfo?.positions.map((position, index) => (
        <DetectionObject
          key={index}
          index={index + 1}
          left={position[0] - left * scaleFactors.imageScaleX}
          top={position[1] - top * scaleFactors.imageScaleY}
          angle={position[2]}
          type={detectPositionInfo.type}
          width={detectPositionInfo.width}
          height={detectPositionInfo.height}
          fill={detectPositionInfo.fill}
          stroke={detectPositionInfo.stroke}
          adjacentBbox={rotatedBoxInfoList[adjacentBoxList[index]]}
          rotatedBoxInfoList={rotatedBoxInfoList}
          onChangeStatus={active => {
            completeStatues[index] = active;
            setMinimumProgress();
            checkAllComplete();
          }}
        />
      )),
    [detectPositionInfo, left, top, scaleFactors, rotatedBoxInfoList]
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: height + 'px',
      }}
    >
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
        viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
      >
        {detectionObjects}
      </svg>
      {isDev && (
        <DevModeDetectionOverlay
          positionInfo={detectPositionInfo}
          scaleFactors={scaleFactors}
          naturalWidth={naturalWidth}
          naturalHeight={naturalHeight}
          rotatedBoxInfoList={rotatedBoxInfoList}
        />
      )}
    </div>
  );
};

export default DetectionRender;
