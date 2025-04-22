import { useMemo } from 'react';
import { getD3PathFromImageData } from 'UtilFarm/visual/d3';
import { getSegmentWLine } from 'UtilFarm/visual/segmentPreset';

interface GuideLineProps {
  baseImage: ImageData;
  width: number;
  height: number;
}

const SegmentLine = ({ baseImage, width, height }: GuideLineProps) => {
  const segmentLinePath = useMemo(
    () => getSegmentWLine(width, height),
    [width, height]
  );

  const clipPath = useMemo(
    () => getD3PathFromImageData(baseImage, width, height),
    [baseImage, width, height]
  );

  return (
    <svg
      className="z-10"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: width,
        height: height,
      }}
    >
      <defs>
        <clipPath id="segment-clip">
          <use xlinkHref="#segment" />
        </clipPath>
      </defs>

      <path
        id="segment"
        d={clipPath.join(' ')}
        style={{
          fill: 'none',
          stroke: '#04fc04',
          strokeDasharray: '15 5',
          strokeWidth: 4,
        }}
      />
      <g clipPath="url(#segment-clip)">
        {segmentLinePath.map((point, index) => {
          const nextPoint = segmentLinePath[index + 1] || segmentLinePath[0];

          return (
            <line
              key={index}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke="#04fc04"
              strokeWidth="4"
              strokeDasharray="15 5"
              strokeLinejoin="round"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default SegmentLine;
