import * as d3 from 'd3';

type Segment = {
  data: Uint8Array;
  svgElement: SVGElement;
  threshold: number[];
  segmentWidth: number;
  segmentHeight: number;
  containerWidth: number;
  containerHeight: number;
};

type RenderOptions = {
  fill: string;
  stroke: string;
  opacity: string;
  'stroke-width': string;
};

// 자주 사용되는 D3 인스턴스를 캐싱
const createCachedContours = (() => {
  const cache = new Map();

  return (width: number, height: number, threshold: number[]) => {
    const key = `${width}-${height}-${threshold.join(',')}`;
    if (!cache.has(key)) {
      cache.set(key, d3.contours().size([width, height]).thresholds(threshold));
    }
    return cache.get(key);
  };
})();

const createCachedScale = (() => {
  const cache = new Map();

  return (domain: [number, number], range: [number, number]) => {
    const key = `${domain.join('-')}-${range.join('-')}`;
    if (!cache.has(key)) {
      cache.set(key, d3.scaleLinear().domain(domain).range(range));
    }
    return cache.get(key);
  };
})();

export const renderSegmentWithD3 = (
  segment: Segment,
  options: RenderOptions
) => {
  const {
    data,
    svgElement,
    threshold,
    segmentWidth,
    segmentHeight,
    containerWidth,
    containerHeight,
  } = segment;

  // 캐시된 contours 사용
  const contourAll = createCachedContours(
    segmentWidth,
    segmentHeight,
    threshold
  ) as d3.Contours;

  // 캐시된 scale 사용
  const xScale = createCachedScale([0, segmentWidth], [0, containerWidth]);
  const yScale = createCachedScale([0, segmentHeight], [0, containerHeight]);

  // line 함수 메모이제이션
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  const svg = d3.select(svgElement);

  // 데이터 변환을 최적화
  const dataArray = Array.from(data); // 한 번만 변환

  // path 업데이트 최적화
  const paths = svg.selectAll('path').data(contourAll(dataArray));

  // enter + update 패턴 최적화
  const enterPaths = paths.enter().append('path');

  // 스타일 일괄 적용
  const allPaths = enterPaths.merge(paths as any);
  Object.entries(options).forEach(([key, value]) => {
    allPaths.style(key, value);
  });

  // 속성 설정 최적화
  allPaths
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr('d', d => {
      // coordinates 처리 최적화
      return d.coordinates
        .reduce((acc, ring) => {
          acc.push(
            ring
              .map((point: any) => line(point as [number, number][]))
              .join(' ')
          );
          return acc;
        }, [] as string[])
        .join(' ');
    });

  // 불필요한 path 제거
  paths.exit().remove();
};

export const getD3PathFromImageData = (
  imageData: ImageData,
  svgWidth: number,
  svgHeight: number
) => {
  const { width, height, data } = imageData;

  // TypedArray 사용하여 메모리 최적화
  const area = new Float32Array(width * height);

  // 최적화된 픽셀 처리
  const length = data.length;
  for (let i = 0; i < length; i += 4) {
    const index = i >> 2;
    if (data[i + 3] > 0) {
      area[index] = 1;
    }
  }

  // 캐시된 contours 사용
  const contour = createCachedContours(width, height, [0.5]) as d3.Contours;

  // 캐시된 scale 사용
  const xScale = createCachedScale([0, width], [0, svgWidth]);
  const yScale = createCachedScale([0, height], [0, svgHeight]);

  // 메모이제이션된 line 함수
  const line = d3
    .line()
    .curve(d3.curveBasis)
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

  const contours = contour(Array.from(area));

  // 최적화된 contours 처리
  return contours.map(contour => {
    return contour.coordinates
      .reduce((acc, ring) => {
        acc.push(
          ring.map(point => line(point as [number, number][])).join(' ')
        );
        return acc;
      }, [] as string[])
      .join(' ');
  });
};
