export const getSegmentWLine = (width: number, height: number) => [
  { x: width * 0.1015625, y: 0 },
  { x: width * 0.3178807947, y: height },
  { x: width * 0.5, y: 0 },
  { x: width * 0.703125, y: height },
  { x: width * 0.8984375, y: 0 },
];

export const segmentPresetW = (width: number, height: number) => {
  const wCoordinates = getSegmentWLine(width, height);

  return [
    [
      0,
      0,
      wCoordinates[0].x,
      0,
      wCoordinates[1].x,
      wCoordinates[1].y,
      0,
      wCoordinates[1].y,
    ],
    [
      wCoordinates[0].x,
      0,
      wCoordinates[2].x,
      0,
      wCoordinates[1].x,
      wCoordinates[1].y,
      wCoordinates[0].x,
      wCoordinates[2].y,
    ],
    [
      wCoordinates[2].x,
      0,
      wCoordinates[2].x,
      0,
      wCoordinates[3].x,
      wCoordinates[3].y,
      wCoordinates[1].x,
      wCoordinates[3].y,
    ],
    [
      wCoordinates[2].x,
      0,
      wCoordinates[4].x,
      0,
      wCoordinates[3].x,
      wCoordinates[3].y,
      wCoordinates[2].x,
      wCoordinates[2].y,
    ],
    [wCoordinates[4].x, 0, width, 0, width, height, wCoordinates[3].x, height],
  ];
};

export const segmentWLineToPath = (width: number, height: number) => {
  const points = getSegmentWLine(width, height);

  // points를 SVG path 문자열로 변환
  return `M${points[0].x} ${points[0].y}
          L${points[1].x} ${points[1].y}
          L${points[2].x} ${points[2].y}
          L${points[3].x} ${points[3].y}
          L${points[4].x} ${points[4].y}`;
};
