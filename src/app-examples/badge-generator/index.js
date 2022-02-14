import React, { createRef, useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { PrimaryButton, SecondaryButton } from "@workday/canvas-kit-react/button";
import { colors, space, type } from "@workday/canvas-kit-react/tokens";
import FormField, { FormFieldLabelPosition } from "@workday/canvas-kit-react/form-field";
import { Modal, useModalModel } from "@workday/canvas-kit-react/modal";
import { Layout } from "@workday/canvas-kit-react/layout";
import { LoadingDots } from "@workday/canvas-kit-react/loading-animation";
import { Popper } from "@workday/canvas-kit-react/popup";
import { Toast } from "@workday/canvas-kit-react/toast";
import { cameraPlusIcon, exclamationCircleIcon, loopIcon, uploadClipIcon, uploadCloudIcon } from '@workday/canvas-system-icons-web';

import { blobToDataURL } from '../../common/utils/FileUtils';

import PageHeader from '../../common/components/PageHeader';

import { getBadgeAttachment, getCurrentBadgeData, getWorkerData, postBadge } from './BadgeAppData';
import BadgeImageCanvas from './BadgeImageCanvas';
import BadgeImageCapture from './BadgeImageCapture';

/* 
Generate and upload Worker Badge images to Workday, storing data in Application Business Objects. 
Leverages HTML5 Canvas to create a custom badge image using a source image or webcam capture in 
conjunction with worker information contained in Workday, such as the Worker's name and location. 
This example is for demo purposes and is not officially supported by Workday.
*/
const BadgeGenerator = () => {
  const CreationMode = {
    CAMERA: "camera",
    FILE_UPLOAD: "file_upload"
  };

  const BADGE_IMAGE_FORMAT_TYPE = 'image/jpeg';
  const BADGE_IMAGE_FILE_EXTENSION = '.jpg';

  const badgeImageCanvasRef = createRef();
  const fileUploadRef = useRef();
  const creationModalModel = useModalModel();
  const toastsAnchorRef = useRef();

  const [creationMode, setCreationMode] = useState(null);
  const [currentBadgeAttachmentUri, setCurrentBadgeAttachmentUri] = useState(null);
  const [currentBadgeMetadata, setCurrentBadgeMetadata] = useState(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [proposedSourceImageUri, setProposedSourceImageUri] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [workerData, setWorkerData] = useState({});

  // react hooks
  useEffect(() => {
    const initialize = async () => {
      const workerData = await getWorkerData('me');
      const badgeData = workerData.id ? await getCurrentBadgeData(workerData.id) : null;
      const badgeAttachment = badgeData.id ? await getBadgeAttachment(badgeData.id) : null;

      setWorkerData(workerData);
      setCurrentBadgeMetadata(badgeData);
      setCurrentBadgeAttachmentUri(badgeAttachment);
      setIsPageLoading(false);
    };
    
    initialize();
  }, []);

  //  page events
  const onSaveToWorkday = async () => {
    //  helper to read current badge image canvas contents as blob
    const readAttachmentFromCanvas = async () => {
      const ctx = badgeImageCanvasRef.current.getContext('2d');
      return new Promise((resolve) => {
        ctx.canvas.toBlob((blob) => {
          resolve(blob);
        }, BADGE_IMAGE_FORMAT_TYPE);
      });
    };

    setIsPageLoading(true);
    creationModalModel.events.hide();

    //  read attachment from canvas
    //  create multi-part request to upload badge metadata and attachment
    const attachment = await readAttachmentFromCanvas();
    const formData = new FormData();
    const now = new Date();

    const badgeMetadata = {
      file: "cid:attachment",
      dateUploaded: now.toISOString(),
      worker: {
        id: workerData.id
      }
    };
    const badgeFileName = `badge-${workerData.id}-${now.getTime()}${BADGE_IMAGE_FILE_EXTENSION}`;
    formData.append("data", JSON.stringify(badgeMetadata));
    formData.append("attachment", attachment, badgeFileName);

    //  make post request to create badge
    //  let the fetch api dynamically set the content-type header, setting it explicitly will fail
    const saveResponse = await postBadge(formData, badgeFileName);

    //  parse response, create toast for error/success accordingly
    if(saveResponse.error) {
      console.error(saveResponse);
      setToasts([{
        key: Date.now(),
        icon: exclamationCircleIcon,
        color: colors.cinnamon500,
        text: "Unable to Upload Badge. Check Console for more details."
      }]);
    }
    else {
      // query workday for new badge data and update page
      const badgeData = workerData.id ? await getCurrentBadgeData(workerData.id) : null;
      const badgeAttachment = badgeData.id ? await getBadgeAttachment(badgeData.id) : null;      
      setCurrentBadgeMetadata(badgeData);
      setCurrentBadgeAttachmentUri(badgeAttachment);
      setToasts([{
        key: Date.now(),
        icon: uploadCloudIcon,
        color: colors.greenApple500,
        text: "Badge Uploaded Successfully"
      }]);
    }
    resetPage();
  };

  const onFileUpload = () => {
    const fileList = fileUploadRef.current;
    const file = fileList.files[0];

    if (file) {
      blobToDataURL(file)
        .then((result) => {
          setProposedSourceImageUri(result);
        });
    }
    else {
      setProposedSourceImageUri(null);
    }
  };

  const resetPage = () => {
    setCreationMode(null);
    setIsPageLoading(false);
    setProposedSourceImageUri(null);
    creationModalModel.events.hide();
  };

  const onTryAgain = () => {
    setProposedSourceImageUri(null);
  };

  return (
    <React.Fragment>
      <PageHeader id="pageHeader" title="Badge Generator" />

      <LayoutContainer ref={toastsAnchorRef}>
        <Popper placement="top" open={toasts.length > 0} anchorElement={toastsAnchorRef}>
          {toasts.map((toast) => <Toast key={toast.key} iconColor={toast.color} icon={toast.icon} onClose={() => setToasts(toasts.filter((t) => t.key !== toast.key))}>{toast.text} </Toast>)}
        </Popper>

        {isPageLoading ?
          <LoadingAnimationContainer>
            <LoadingDots />
          </LoadingAnimationContainer>
          :
          <Layout>
            <Layout.Column columns={6}>
              <LayoutSectionTitle>Worker</LayoutSectionTitle>
              <CanvasLabel>Name</CanvasLabel>
              <CanvasLabelValue>{workerData?.descriptor}</CanvasLabelValue>
              <CanvasLabel>Title</CanvasLabel>
              <CanvasLabelValue>{workerData?.primaryJob?.businessTitle}</CanvasLabelValue>
              <CanvasLabel>Location</CanvasLabel>
              <CanvasLabelValue>{workerData?.primaryJob?.location?.descriptor}</CanvasLabelValue>

              <LayoutSectionTitle>Generate New Badge</LayoutSectionTitle>
              <PrimaryButton
                size={"medium"}
                icon={cameraPlusIcon}
                onClick={() => { setCreationMode(CreationMode.CAMERA); creationModalModel.events.show(); }}>Take Photo</PrimaryButton>
              <SecondaryButton
                size={"medium"}
                icon={uploadClipIcon}
                onClick={() => { setCreationMode(CreationMode.FILE_UPLOAD); creationModalModel.events.show(); }}
                style={{ marginLeft: space.m }}>Upload Photo</SecondaryButton>
            </Layout.Column>
            <Layout.Column columns={6}>
              <LayoutSectionTitle>Current Badge</LayoutSectionTitle>
              {currentBadgeAttachmentUri ?
                <React.Fragment>
                  <Layout.Column>
                    <img src={currentBadgeAttachmentUri} alt="current badge" />
                  </Layout.Column>
                  <Layout.Column>
                    <CanvasLabel>Workday ID</CanvasLabel>
                    <CanvasLabelValue>{currentBadgeMetadata?.id}</CanvasLabelValue>
                    <CanvasLabel>Date Uploaded</CanvasLabel>
                    <CanvasLabelValue>{currentBadgeMetadata?.dateUploaded}</CanvasLabelValue>
                  </Layout.Column>
                </React.Fragment>
                :
                <p>No Badge exists for this Worker.</p>
              }
            </Layout.Column>
          </Layout>
        }
      </LayoutContainer>

      <Modal model={creationModalModel}>
        <Modal.Overlay>
          <Modal.Card style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', width: '600px' }}>
            <Modal.CloseIcon aria-label="Close" />
            <Modal.Heading>Generate New Badge</Modal.Heading>
            <Modal.Body>
              {creationMode === CreationMode.CAMERA ?
                <Layout style={{ display: !proposedSourceImageUri ? 'block' : 'none' }}>
                  <Layout.Column>
                    <BadgeImageCapture onImageCaptured={(imageUri) => setProposedSourceImageUri(imageUri)}  />
                  </Layout.Column>
                </Layout>
                :
                null
              }
              {creationMode === CreationMode.FILE_UPLOAD ?
                <Layout style={{ display: !proposedSourceImageUri ? 'block' : 'none' }}>
                  <FormField label="Select a File" labelPosition={FormFieldLabelPosition.Top} inputId="imageUpload" required={false}>
                    <input ref={fileUploadRef} type="file" accept=".jpg, .jpeg, .gif, .png" onChange={onFileUpload} />
                  </FormField>
                </Layout>
                :
                null
              }
              <Layout style={{ display: proposedSourceImageUri ? 'block' : 'none' }}>
                <FormField label="Generated Badge Image" labelPosition={FormFieldLabelPosition.Top} inputId="generatedImage" required={false}>
                  <BadgeImageCanvas imageHeight={760} imageWidth={480} formatType={BADGE_IMAGE_FORMAT_TYPE} ref={badgeImageCanvasRef} workerData={workerData} imageUri={proposedSourceImageUri} />
                </FormField>
                <PrimaryButton
                  size={"medium"}
                  icon={uploadCloudIcon}
                  onClick={onSaveToWorkday}
                  disabled={!proposedSourceImageUri}>Save to Workday</PrimaryButton>
                <SecondaryButton
                  size={"medium"}
                  icon={loopIcon}
                  onClick={onTryAgain}
                  disabled={!proposedSourceImageUri}
                  style={{ marginLeft: space.m }}>Try Again</SecondaryButton>
              </Layout>
            </Modal.Body>
          </Modal.Card>
        </Modal.Overlay>
      </Modal>
    </React.Fragment>
  );
};

const CanvasLabel = styled('label')({
  marginTop: space.s,
  fontWeight: type.properties.fontWeights.medium
});

const CanvasLabelValue = styled('p')({
  marginTop: space.xxs
});

const LoadingAnimationContainer = styled.div({
  left: "calc(50% - 38px)",
  position: "absolute",
  top: "50%"
});

const LayoutContainer = styled('div')({
  marginLeft: space.m,
  marginRight: space.m,
  paddingBottom: space.xxl,
  ...type.levels.subtext.large
});

const LayoutSectionTitle = styled('h2') ({
  ...type.levels.heading.small
});

export default BadgeGenerator;
