import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';

let worker: Worker | null = new Worker('/worker.js');

interface Props {
  width: number;
  height: number;
  left: number;
  top: number;
  imageData?: ImageData;
  stepCode: number | string;
  direction: number;
  onLoadColorImage?: (compressedData: ImageData) => void;
}

const CanvasStyle = styled.canvas`
  position: absolute;
  z-index: 12;
`;

export const ColormapRenderer = ({ onLoadColorImage, ...props }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(worker);

  const preference = useSelector((state: RootState) => state.preference);
  const host = useMemo(
    () => `${preference.hostname}:${preference.GUIDE_PORT}`,
    [preference.hostname, preference.GUIDE_PORT]
  );

  useEffect(() => {
    if (!canvasRef.current || !workerRef.current) return;

    const worker = workerRef.current;

    const canvas = canvasRef.current;
    const offscreen = canvas.transferControlToOffscreen();

    /**
     * @params {
     * type: "init" | "stop", canvas: HTMLCanvasElement,
     * width: number, 
     * height: number, imageData: ImageData,
     * direction: 0 | 1,
       step: number,
       host: string
     * }
     */
    worker.postMessage(
      {
        type: 'init',
        canvas: offscreen,
        width: canvas.width,
        height: canvas.height,
        imageData: props.imageData,
        direction: props.direction,
        step: props.stepCode,
        host,
      },
      [offscreen]
    );

    worker.onmessage = e => {
      if (e.data.imageData) {
        onLoadColorImage?.(e.data.imageData as ImageData);
      }
    };

    return () => {
      worker?.postMessage({
        type: 'stop',
      });
    };
  }, [host]);

  useLayoutEffect(() => {
    if (!canvasRef.current || !workerRef.current) return;

    const worker = workerRef.current;

    worker.postMessage(
      {
        type: 'update',
        width: props.width,
        height: props.height,
        imageData: props.imageData,
        direction: props.direction,
        step: props.stepCode,
        host,
      },
      []
    );
  }, [props.imageData, props.stepCode, props.direction, host]);

  return (
    <CanvasStyle
      ref={canvasRef}
      style={{ top: props.top, left: props.left }}
      width={props.width}
      height={props.height}
    />
  );
};
