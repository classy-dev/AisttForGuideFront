import React, { useLayoutEffect, useMemo } from 'react';
import ReactJson from 'react-json-view';
import { fabric } from 'fabric';
import styled from '@emotion/styled';
import SearchGuideImage from 'ComponentFarm/editor/SearchGuideImage';

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;

  canvas {
    border: 4px solid #e5e5e5;
    border-radius: 20px;
  }

  button {
    margin: 0 10px;
    padding: 10px 20px;
    background-color: #e5e5e5;
    border: none;
    border-radius: 10px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }

  .styles {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 20px;

    input {
      padding: 0.5rem;
      border-radius: 10px;
      border: 1px solid #e5e5e5;
      &:disabled {
        opacity: 0.5;
      }

      &:not([type='radio'], [type='checkbox']) {
        width: 100px;
      }

      &[type='radio'] {
        margin: 0 5px;
      }
    }
  }

  .content {
    display: flex;

    align-items: center;
    justify-content: stretch;
    margin-bottom: 20px;
    position: relative;

    p {
      position: absolute;
      left: 100%;
      width: 400px;
      margin-left: 20px;
      white-space: pre-wrap;
      word-break: break-all;
      overflow-x: auto;
      height: 100%;
      background: blue;
      color: white;
      font-weight: bold;
      border: 4px solid #e5e5e5;
      border-radius: 20px;
      padding: 8px;
    }
  }

  .row {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const initCanvas = () => {
  return new fabric.Canvas('canvas', {
    width: 1024,
    backgroundColor: 'transparent',
    selection: false,
    renderOnAddRemove: true,
  });
};

const SHAPES = ['rect', 'circle', 'triangle'] as const;

const EditDetectPositions = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [shapeWidth, setShapeWidth] = React.useState('100');
  const [shapeHeight, setShapeHeight] = React.useState('100');
  const [shapeAngle, setShapeAngle] = React.useState('0');
  const [shapeColor, setShapeColor] = React.useState('#FF4600');
  const [shapeStrokeColor, setShapeStrokeColor] = React.useState('#FFFF00');
  const [scale, setScale] = React.useState(1);
  const [shapeType, setShapeType] = React.useState<(typeof SHAPES)[number]>(
    SHAPES[0]
  );
  const [fabricJSON, setFabricJSON] = React.useState<any>({});

  const fabricRef = React.useRef<fabric.Canvas>();

  useLayoutEffect(() => {
    fabricRef.current = initCanvas();
    const onAfterRender = () => {
      const obj = fabricRef.current?.toDatalessJSON();
      console.log('rendered', obj);
      setFabricJSON(obj);
    };

    fabricRef.current.on('after:render', onAfterRender);

    return () => {
      fabricRef.current?.off('after:render', onAfterRender);
      fabricRef.current?.dispose();
      if (fabricRef.current) {
        fabricRef.current = undefined;
      }
    };
  }, []);

  const COMMON_SHAPE_OPTIONS = {
    lockUniScaling: true,
    lockScalingFlip: true,
    lockScalingX: true,
    lockScalingY: true,
    hasControls: true,
    borderColor: 'blue',
    cornerColor: 'green',
    cornerSize: 8,
    originX: 'center',
    originY: 'center',
    opacity: 0.5,
    left: 100,
    top: 100,
  };

  const clearCanvas = () => {
    fabricRef?.current?.clear();
    setScale(1);
    setIsLoaded(false);
  };

  const initializeCanvas = (imageURL: string) => {
    const canvas = fabricRef.current;

    if (!imageURL || !canvas) {
      alert("Can't set image");
      return;
    }
    const image = new Image();

    image.src = imageURL;
    image.crossOrigin = 'anonymous';

    canvas.clear();
    image.onload = () => {
      const ratio = image.naturalWidth / image.naturalHeight;
      const fabricWidth = fabricRef.current?.getWidth() ?? 1024;
      const fabricHeight = fabricWidth / ratio;

      const scaleX = fabricWidth / image.naturalWidth;
      const scaleY = fabricHeight / image.naturalHeight;

      const scaleReverse = Math.min(
        image.naturalWidth / fabricWidth,
        image.naturalHeight / fabricHeight
      );

      setScale(scaleReverse);

      canvas.setWidth(fabricWidth);
      canvas.setHeight(fabricHeight);

      canvas.setBackgroundImage(
        new fabric.Image(image, {
          left: 0,
          top: 0,
          scaleX,
          scaleY,
          originX: 'left',
          originY: 'top',
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
        }),
        canvas.renderAll.bind(canvas)
      );
      image.onerror = clearCanvas;

      setIsLoaded(true);
    };
  };

  const addShape = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (shapeType === 'rect') {
      const rect = new fabric.Rect({
        fill: shapeColor,
        width: Number(shapeWidth),
        height: Number(shapeHeight),
        angle: Number(shapeAngle),
        centeredRotation: true,
        ...COMMON_SHAPE_OPTIONS,
      });
      canvas.add(rect);
    } else if (shapeType === 'circle') {
      const circle = new fabric.Circle({
        fill: shapeColor,
        width: Number(shapeWidth),
        height: Number(shapeWidth),
        radius: Number(shapeWidth) / 2,
        ...COMMON_SHAPE_OPTIONS,
      });
      canvas.add(circle);
    } else if (shapeType === 'triangle') {
      const triangle = new fabric.Triangle({
        fill: shapeColor,
        width: Number(shapeWidth),
        height: Number(shapeHeight),
        angle: Number(shapeAngle),
        centeredRotation: true,
        ...COMMON_SHAPE_OPTIONS,
      });
      canvas.add(triangle);
    }
  };

  const resultsJSON = useMemo(
    () => ({
      type: shapeType,
      width: Number(shapeWidth) * scale,
      height: Number(shapeType !== 'circle' ? shapeHeight : shapeWidth) * scale,
      fill: shapeColor,
      stroke: shapeStrokeColor,
      positions: fabricJSON?.objects?.map((obj: any) => [
        obj.left * scale,
        obj.top * scale,
        obj.angle ?? 0,
      ]),
    }),
    [fabricJSON, shapeColor, shapeHeight, shapeType, shapeWidth, scale]
  );

  return (
    <EditorWrapper>
      <SearchGuideImage
        disabled={isLoaded}
        onClickImage={src => initializeCanvas(src)}
      />
      <div className="content">
        <canvas id="canvas" />
        <ReactJson
          src={resultsJSON}
          style={{
            position: 'absolute',
            width: 400,
            left: '100%',
            height: '100%',
            overflow: 'auto',
            marginLeft: 20,
          }}
        />
      </div>

      <div className="row">
        <div className="styles">
          <label>Shape type:</label>
          {SHAPES.map(shape => (
            <label id={shape}>
              <input
                type="radio"
                name="shape"
                key={shape}
                value={shape}
                checked={shapeType === shape}
                disabled={!isLoaded}
                onChange={() => setShapeType(shape)}
              />
              {shape}
            </label>
          ))}
        </div>
        <div className="styles">
          <label>Fill color:</label>
          <input
            type="color"
            disabled={!isLoaded}
            value={shapeColor}
            onChange={e => setShapeColor(e.target.value)}
          />
        </div>
        <div className="styles">
          <label>Stroke color:</label>
          <input
            type="color"
            disabled={!isLoaded}
            value={shapeStrokeColor}
            onChange={e => setShapeStrokeColor(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <div className="styles">
          <label>width:</label>
          <input
            type="text"
            value={shapeWidth}
            onChange={e => setShapeWidth(e.target.value)}
          />
        </div>
        <div className="styles">
          <label>height:</label>
          <input
            type="text"
            value={shapeHeight}
            onChange={e => setShapeHeight(e.target.value)}
          />
        </div>
        <div className="styles">
          <label>angle:</label>
          <input
            type="text"
            value={shapeAngle}
            onChange={e => setShapeAngle(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        <button
          onClick={() => {
            const imageURL = window.prompt('이미지 URL을 입력해주세요', '');

            initializeCanvas(imageURL ?? '');
          }}
        >
          Set guide image
        </button>
        <button disabled={!isLoaded} onClick={() => addShape()}>
          Add Shape
        </button>
        <button
          disabled={!isLoaded}
          onClick={() => {
            fabricRef?.current
              ?.getObjects()
              .forEach(obj => fabricRef?.current?.remove(obj));
          }}
        >
          Clear objects
        </button>
        <button
          disabled={!isLoaded}
          onClick={() => {
            fabricRef?.current?.clear();
            setScale(1);
            setIsLoaded(false);
          }}
        >
          Clear All
        </button>
      </div>
    </EditorWrapper>
  );
};

export default EditDetectPositions;
