interface ShapeProps {
  text?: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  angle?: number;
  active?: boolean;
  isolation?: 'auto' | 'isolate';
}

type SVGGroupProps = Pick<
  ShapeProps,
  'left' | 'top' | 'width' | 'height' | 'isolation'
>;

const SVGGroup = ({
  left,
  top,
  width,
  height,
  isolation,
  children,
}: React.PropsWithChildren<SVGGroupProps>) => (
  <g
    transform={`translate(${left - width / 2}, ${top - height / 2})`}
    style={{ isolation }}
  >
    {children}
  </g>
);

export const Circle = ({
  left,
  top,
  width,
  height,
  fill,
  text,
  stroke,
  active,
  isolation,
}: ShapeProps) => (
  <SVGGroup
    left={left}
    top={top}
    width={width}
    height={height}
    isolation={isolation}
  >
    <circle
      cx={width / 2}
      cy={width / 2}
      r={width / 2}
      fill={active ? fill : 'none'}
      stroke={active ? undefined : stroke}
      strokeWidth={active ? 0 : width / 14}
      strokeDasharray={`${width / 2} ${width / 6}`}
      strokeLinecap="round"
    />
    {text && (
      <text
        x={width / 2}
        y={width / 2 + width / 20}
        textAnchor="middle"
        dominantBaseline={'middle'}
        fill={active ? 'white' : stroke}
        fontSize={(width + height) / 2 / 2.4}
        fontWeight="700"
      >
        {text}
      </text>
    )}
  </SVGGroup>
);

export const Rect = ({
  left,
  top,
  width,
  height,
  fill,
  text,
  angle,
  stroke,
  active,
  isolation,
}: ShapeProps) => (
  <SVGGroup
    left={left}
    top={top}
    width={width}
    height={height}
    isolation={isolation}
  >
    <rect
      width={width}
      height={height}
      fill={active ? fill : 'none'}
      stroke={active ? undefined : stroke}
      strokeWidth={active ? 0 : width / 14}
      strokeDasharray={`${width / 2} ${width / 6}`}
      strokeLinecap="round"
      rx={width * 0.15}
      transform={`rotate(${angle}, ${width / 2}, ${height / 2})`}
    />
    {text && (
      <text
        x={width / 2}
        y={height / 2 + height / 20}
        textAnchor="middle"
        dominantBaseline={'middle'}
        fill={active ? 'white' : stroke}
        fontSize={(width + height) / 2 / 2.4}
        fontWeight="700"
      >
        {text}
      </text>
    )}
  </SVGGroup>
);

export const Triangle = ({
  left,
  top,
  width,
  height,
  fill,
  text,
  angle,
  stroke,
  active,
  isolation,
}: ShapeProps) => (
  <SVGGroup
    left={left}
    top={top}
    width={width}
    height={height}
    isolation={isolation}
  >
    <g transform={`translate(${left - width / 2}, ${top - height / 2}) `}>
      <polygon
        points={`${width / 2},0 ${width},${height} 0,${height}`}
        fill={active ? fill : 'none'}
        stroke={active ? undefined : stroke}
        strokeWidth={active ? 0 : width / 14}
        strokeDasharray={`${width / 2} ${width / 6}`}
        strokeLinecap="round"
      />
      {text && (
        <text
          x={width / 2}
          y={height / 2 + height / 6}
          textAnchor="middle"
          dominantBaseline={'middle'}
          fill={active ? 'white' : stroke}
          fontSize={(width + height) / 2 / 2.5}
          fontWeight="700"
        >
          {text}
        </text>
      )}
    </g>
  </SVGGroup>
);

export const ShapeByType = ({
  type,
  ...shapeProps
}: ShapeProps & { type: string }) => {
  if (type === 'circle') {
    return <Circle {...shapeProps} />;
  } else if (type === 'rect') {
    return <Rect {...shapeProps} />;
  } else if (type === 'triangle') {
    return <Triangle {...shapeProps} />;
  }

  return null;
};
