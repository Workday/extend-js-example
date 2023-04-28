import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { PrimaryButton } from "@workday/canvas-kit-react/button";
import { space } from "@workday/canvas-kit-react/tokens";
import { cameraPlusIcon } from '@workday/canvas-system-icons-web';
import { Grid } from '@workday/canvas-kit-react/layout';

const BadgeImageCapture = (props) => {
  const BADGE_IMAGE_HEIGHT = 760;
  const BADGE_IMAGE_WIDTH = 480;
  const BADGE_FORMAT_TYPE = 'image/jpg';
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  const [cameraNotEnabled, setCameraNotEnabled] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const handleImageCaptured = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.width = BADGE_IMAGE_WIDTH;
    ctx.height = BADGE_IMAGE_HEIGHT;
    ctx.drawImage(videoRef.current, 0, 0, BADGE_IMAGE_WIDTH, BADGE_IMAGE_HEIGHT);
    const uri = canvasRef.current.toDataURL(BADGE_FORMAT_TYPE);
    return props.onImageCaptured(uri);
  };

  //  start camera stream when component is mounted
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: BADGE_IMAGE_WIDTH, height: BADGE_IMAGE_HEIGHT }
    })
    .then((stream) => {
      setCameraStream(stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    })
    .catch(error => {
      console.error(error);
      setCameraStream(null);
      setCameraNotEnabled(true);
    });

    videoRef.current.addEventListener('canplay', () => {
      canvasRef.current.setAttribute('height', BADGE_IMAGE_HEIGHT);
      canvasRef.current.setAttribute('width', BADGE_IMAGE_WIDTH);
    }, false);
  }, []);

  //  stop camera stream when component unmounts
  useEffect(() => () => {
    if(cameraStream) {
      cameraStream.getTracks().forEach(function(track) {
        track.stop();
      });
      setCameraStream(null);
    }
  }, [cameraStream]);

  return (
    <Grid>
      <CaptureContainer>
        <p style={{ display: cameraNotEnabled ? 'block' : 'none' }}>Please enable your camera to capture a photo.</p>
        <video id="video" ref={videoRef} preload="none">Your browser does not support photo capture.</video>
        <canvas id="canvas" ref={canvasRef} style={{ display: 'none' }} />
      </CaptureContainer>
      <PrimaryButton
        size={"medium"}
        icon={cameraPlusIcon}
        onClick={handleImageCaptured} disabled={cameraNotEnabled}>Take Photo</PrimaryButton>
    </Grid>
  );
};

const CaptureContainer = styled('div') ({
  marginBottom: space.m,
  marginLeft: "auto",
  marginRight: "auto"
});

export default BadgeImageCapture;
