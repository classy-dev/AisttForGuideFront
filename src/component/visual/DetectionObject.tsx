import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useAdjustBoundingBox from 'HookFarm/useAdjustBoundingBox';
import { BoundingBox, calculateIoU } from 'UtilFarm/visual/boundingBox';
import { ShapeByType } from './DetectionShape';

interface Props {
  index: number;
  active?: boolean;
  width: number;
  height: number;
  type: string;
  fill: string;
  stroke: string;
  left: number;
  top: number;
  angle?: number;
  adjacentBbox: BoundingBox | null;
  rotatedBoxInfoList: BoundingBox[];
  onChangeStatus: (active: boolean) => void;
}

const checkBestMatch = (bbox: BoundingBox, adjacentBbox: BoundingBox) => {
  const iou = calculateIoU(bbox, adjacentBbox);

  return iou > 0.25 ? adjacentBbox : null;
};

const DetectionObject = ({
  index,
  width,
  height,
  type,
  fill,
  stroke,
  left,
  top,
  angle = 0,
  rotatedBoxInfoList,
  adjacentBbox,
  onChangeStatus,
}: Props) => {
  const latestBoxTimerRef = useRef(0);
  const [hitmap, setHitmap] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const Bbox = useMemo(
    () => [
      left - width / 2,
      top - height / 2,
      left - width / 2 + width,
      top - height / 2 + height,
    ],
    [left, top, width, height]
  );

  const [latestBox, setLatestBox] = useState<BoundingBox | null>(null);

  const active = useMemo(() => hitmap > 0, [hitmap]);
  const adjustedBox = useAdjustBoundingBox(
    adjacentBbox ? adjacentBbox : latestBox,
    width,
    height
  );

  const adjacentPosition = useMemo(
    () =>
      adjustedBox
        ? {
            left: adjustedBox[0],
            top: adjustedBox[1],
            width: Math.max(adjustedBox[2] - adjustedBox[0], width),
            height:
              type === 'circle'
                ? Math.max(adjustedBox[2] - adjustedBox[0], width)
                : Math.max(adjustedBox[3] - adjustedBox[1], height),
          }
        : null,
    [adjustedBox, type, width, height]
  );
  const pathPosition = useMemo(
    () =>
      adjacentPosition
        ? {
            x1: adjacentPosition.left + adjacentPosition.width / 2,
            y1: adjacentPosition.top + adjacentPosition.height / 2,
            x2: Bbox[0] + (Bbox[2] - Bbox[0]) / 2,
            y2: Bbox[1] + (Bbox[3] - Bbox[1]) / 2,
          }
        : null,
    [adjacentPosition, Bbox]
  );

  useLayoutEffect(() => {
    if (adjustedBox) {
      clearTimeout(latestBoxTimerRef.current);
      setLatestBox(adjacentBbox);
      latestBoxTimerRef.current = window.setTimeout(
        () => setLatestBox(null),
        2000
      );
    }
  }, [adjustedBox]);

  useEffect(() => {
    if (adjustedBox && checkBestMatch(Bbox as BoundingBox, adjustedBox)) {
      setHitmap(5);
      if (!active) onChangeStatus(true);
    } else {
      setHitmap(prev => {
        if (prev === 1 && active) {
          onChangeStatus(false);
          setLatestBox(null);
        }

        return Math.max(prev - 1, 0);
      });
    }
  }, [Bbox, rotatedBoxInfoList, adjustedBox, active]);

  return (
    <React.Fragment key={index}>
      <ShapeByType
        type={type}
        left={left}
        top={top}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        angle={angle}
        active={active}
        text={`${index}`}
      />

      {!active && adjacentPosition && (
        <ShapeByType
          type={type}
          left={adjacentPosition.left + adjacentPosition.width / 2}
          top={adjacentPosition.top + adjacentPosition.height / 2}
          width={adjacentPosition.width}
          height={adjacentPosition.height}
          fill={'red'}
          stroke="white"
          angle={angle}
          active={true}
          text={index + ''}
          isolation="isolate"
        />
      )}
      {!active && pathPosition && (
        <>
          <defs>
            <path
              id={`arrowHead-${index}`}
              d="M-15,-15 L15,0 L-15,15 Z"
              fill={stroke}
            />
          </defs>
          <line
            {...pathPosition}
            stroke={stroke}
            strokeWidth="8"
            strokeDasharray={'0 10 0 10 0'}
            markerEnd={`url(#arrowhead-${index})`}
          />
          <use href={`#arrowHead-${index}`}>
            <animateMotion
              dur="1s"
              repeatCount="indefinite"
              path={`M${pathPosition.x1},${pathPosition.y1} L${pathPosition.x2},${pathPosition.y2}`}
              rotate="auto"
            />
          </use>
        </>
      )}
    </React.Fragment>
  );
};

export default DetectionObject;
