import { PositionInfo } from 'InterfaceFarm/menu';
import { BoundingBox, ScaleFactor } from 'UtilFarm/visual/boundingBox';

interface Props {
  positionInfo: PositionInfo | null;
  scaleFactors: ScaleFactor;
  rotatedBoxInfoList: BoundingBox[];
  naturalWidth: number;
  naturalHeight: number;
}

const DevModeDetectionOverlay = ({
  positionInfo,
  scaleFactors,
  rotatedBoxInfoList,
  naturalWidth,
  naturalHeight,
}: Props) => {
  const centerX = naturalWidth / 2;
  const centerY = naturalHeight / 2;

  return (
    <svg
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
      }}
      viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
    >
      <g transform={`translate(${centerX}, ${centerY})`}>
        <rect fill="white" x={-50} y={-50} width={100} height={100} />
        <text
          fontSize={25}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline={'middle'}
        >
          Center
        </text>
      </g>
      {rotatedBoxInfoList.map((box, i) => (
        <g key={i} transform={`translate(${box[0]}, ${box[1]})`}>
          <rect
            width={Math.abs(box[0] - box[2])}
            height={Math.abs(box[1] - box[3])}
            fill="rgba(255, 29, 29, 0.5)"
            stroke="red"
            strokeWidth="2"
          />
          <rect
            width={10}
            height={10}
            x={Math.abs(box[0] - box[2]) / 2}
            y={Math.abs(box[1] - box[3]) / 2}
            fill="blue"
          />
          <text
            x={Math.abs(box[0] - box[2]) / 2}
            y={Math.abs(box[1] - box[3]) / 2}
            fontSize={40}
            fontWeight={700}
          >
            {i}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default DevModeDetectionOverlay;
