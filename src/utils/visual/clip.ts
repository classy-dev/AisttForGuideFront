export const applyHalfRightClip = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const clipPath = new Path2D();
  clipPath.rect(width / 2, 0, width / 2, height);

  ctx.clip(clipPath);
};

export const applyHalfLeftClip = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const clipPath = new Path2D();
  clipPath.rect(0, 0, width / 2, height);

  ctx.clip(clipPath);
};

export const applyDoughInnerClip = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const radiusX = width * 0.41;
  const radiusY = height * 0.405;
  const clipPath = new Path2D();

  clipPath.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);

  ctx.clip(clipPath);
};
