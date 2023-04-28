import styled from '@emotion/styled';

import { LoadingDots } from "@workday/canvas-kit-react/loading-dots";

const LoadingAnimation = styled(LoadingDots) ({
    left: "calc(50% - 38px)",
    position: "absolute",
    top: "50%"
  });

export default LoadingAnimation;