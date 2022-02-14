import React, { useEffect } from 'react';

import { colors } from "@workday/canvas-kit-react/tokens";

const BadgeImageCanvas = React.forwardRef((props, ref) => {
  useEffect(() => {
    const drawBadgeImageOnCanvas = async (imageUri) => {
      const BADGE_CANVAS_WRITE_OPERATION = "source-over";

      const BADGE_BORDER_COLOR = colors.blueberry500;
      const BADGE_FONT_COLOR = colors.frenchVanilla100;
      const BADGE_FONT_STYLE_NAME = "24px Arial";
      const BADGE_FONT_STYLE_SUBTITLE = "12px Arial";
      const BADGE_TEXT_ALIGN = "center";

      const ctx = ref.current.getContext('2d');

      // clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      if (imageUri) {
        ctx.canvas.height = props.imageHeight;
        ctx.canvas.width = props.imageWidth;

        // create image
        const img = new Image();
        img.src = imageUri;
        img.onload = () => {
          // draw image on canvas
          ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

          // outer border
          ctx.globalCompositeOperation = BADGE_CANVAS_WRITE_OPERATION;
          ctx.lineWidth = 80;
          ctx.strokeStyle = BADGE_BORDER_COLOR;
          ctx.strokeRect(0, 0, props.imageWidth, props.imageHeight);

          // name plate
          ctx.globalCompositeOperation = BADGE_CANVAS_WRITE_OPERATION;
          ctx.lineWidth = 80;
          ctx.strokeStyle = BADGE_BORDER_COLOR;
          ctx.strokeRect(0, props.imageHeight - 60, props.imageWidth, props.imageHeight);

          // name
          ctx.globalCompositeOperation = BADGE_CANVAS_WRITE_OPERATION;
          ctx.fillStyle = BADGE_FONT_COLOR;
          ctx.font = BADGE_FONT_STYLE_NAME;
          ctx.textAlign = BADGE_TEXT_ALIGN;
          ctx.fillText(props.workerData?.descriptor, props.imageWidth / 2, props.imageHeight - 60);
          ctx.textAlign = BADGE_TEXT_ALIGN;

          // title
          ctx.globalCompositeOperation = BADGE_CANVAS_WRITE_OPERATION;
          ctx.fillStyle = BADGE_FONT_COLOR;
          ctx.font = BADGE_FONT_STYLE_SUBTITLE;
          ctx.textAlign = BADGE_TEXT_ALIGN;
          ctx.fillText(props.workerData?.primaryJob?.businessTitle, props.imageWidth / 2, props.imageHeight - 40);
          ctx.textAlign = BADGE_TEXT_ALIGN;

          // location
          ctx.globalCompositeOperation = BADGE_CANVAS_WRITE_OPERATION;
          ctx.fillStyle = BADGE_FONT_COLOR;
          ctx.font = BADGE_FONT_STYLE_SUBTITLE;
          ctx.textAlign = BADGE_TEXT_ALIGN;
          ctx.fillText(props.workerData?.primaryJob?.location?.descriptor, props.imageWidth / 2, props.imageHeight - 24);
          ctx.textAlign = BADGE_TEXT_ALIGN;
        }
      }

      await ctx.canvas.toBlob((blob) => {
        ctx.save();
      }, props.formatType);
    };
    
    drawBadgeImageOnCanvas(props.imageUri);
  }, [props.formatType, props.imageHeight, props.imageWidth, props.imageUri, props.workerData, ref]);

  return (
    <canvas ref={ref} alt="badge" style={{ display: 'block', margin: 'auto' }} />
  );
});

export default BadgeImageCanvas;
