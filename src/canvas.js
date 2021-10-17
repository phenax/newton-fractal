import { clamp } from "ramda";

export const createCanvas = (size) => {
  const $canvas = document.createElement("canvas");
  $canvas.width = size.w;
  $canvas.height = size.h;
  $canvas.style.border = "1px solid pink";

  const ctx = $canvas.getContext("2d");

  return { $canvas, ctx };
};

export const forEachPixel = (ctx, size, fn) => {
  const imageData = ctx.getImageData(0, 0, size.w, size.w);

  for (
    let i = 0, pixelCount = 0;
    i < imageData.data.length;
    i += 4, pixelCount++
  ) {
    const x = (pixelCount % size.h) - size.w / 2;
    const y = Math.floor(pixelCount / size.h) - size.h / 2;
    const [r, g, b, a] = fn(x, y) || [0, 0, 0, 0];

    imageData.data[i] = r;
    imageData.data[i + 1] = g;
    imageData.data[i + 2] = b;
    imageData.data[i + 3] = 255 * clamp(0, 1, a);
  }

  ctx.putImageData(imageData, 0, 0);
};
