const alpha = 1;
const COLORS = {
  26: [255, 255, 125, 255 * alpha],
  4: [255, 255, 255, 255 * alpha],
};

let baseImageData = null;
let baseImageWidth = 0;
let baseImageHeight = 0;

const FPS = 1000 / 3;

/** @type {HTMLCanvasElement | null} */
let canvas = null;
let rafId = null;
let host = '';
let direction = null;
let step = -1;
let cnt = 0;

const loadImage = src => {
  return fetch(src)
    .then(r => {
      if (!r.ok) throw new Error('Network response was not ok');

      return r.blob();
    })
    .then(blob => createImageBitmap(blob));
};

/**
 * @param {ImageData} imageData
 * @param {number} rotate degree
 * @returns
 */
const getCompressedImageData = imageData => {
  const compressSize = 3;
  const compressWidth = Math.ceil(imageData.width / compressSize);
  const compressHeight = Math.ceil(imageData.height / compressSize);

  const newCompressed = new Uint8ClampedArray(
    compressWidth * compressHeight * 4
  );

  for (let y = 0; y < compressHeight; y++) {
    for (let x = 0; x < compressWidth; x++) {
      const reverseXYIndex =
        (compressHeight - y - 1) * compressWidth * 4 +
        (compressWidth - x - 1) * 4;
      const rgba = imageData.data.slice(
        (y * compressSize * imageData.width + x * compressSize) * 4,
        (y * compressSize * imageData.width + x * compressSize) * 4 + 4
      );

      newCompressed.set(rgba, reverseXYIndex);
    }
  }

  return new ImageData(newCompressed, compressWidth, compressHeight);
};

const render = () => {
  if (rafId) {
    self.clearInterval(rafId);
  }
  canvas = new OffscreenCanvas(baseImageWidth, baseImageHeight);
  rafId = setInterval(draw, FPS);
};

const draw = async () => {
  if (!canvas) return;

  loadImage(
    `${host}/COLORMAP?direction=${direction}&current_step=${step}`
  ).then(img => {
    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
    });

    ctx.clearRect(0, 0, 9999, 9999);
    ctx.drawImage(img, 0, 0, baseImageWidth, baseImageHeight);

    const imageData = ctx.getImageData(0, 0, baseImageWidth, baseImageHeight);
    const baseColor = COLORS[step] || [0, 0, 0, 255];

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];

      if (r > 0 && g > 0 && b > 0 && a > 100) {
        imageData.data[i] = baseColor[0];
        imageData.data[i + 1] = baseColor[1];
        imageData.data[i + 2] = baseColor[2];
        imageData.data[i + 3] = baseColor[3];
      }

      if (r === 0 && g === 0 && b === 0) {
        imageData.data[i] = 0;
        imageData.data[i + 1] = 0;
        imageData.data[i + 2] = 0;
        imageData.data[i + 3] = 0;
      }
    }

    cnt = cnt === 490 ? 0 : cnt + 10;
    ctx.putImageData(imageData, 0, 0);

    self.postMessage({
      imageData: getCompressedImageData(imageData),
    });
  });
};

self.onmessage = function (e) {
  if (e.data.type === 'init') {
    baseImageData = e.data.imageData;
    baseImageWidth = e.data.width;
    baseImageHeight = e.data.height;
    direction = e.data.direction;
    canvas = e.data.canvas;
    step = e.data.step;
    host = e.data.host;
    render();
  } else if (e.data.type === 'update') {
    baseImageData = e.data.imageData;
    baseImageWidth = e.data.width;
    baseImageHeight = e.data.height;
    direction = e.data.direction;
    step = e.data.step;
    host = e.data.host;
    if (canvas) {
      canvas.width = baseImageWidth;
      canvas.height = baseImageHeight;
    }
    render();
  } else if (e.data.type === 'stop') {
    self.clearInterval(rafId);
  }
};
