import * as React from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';

import { Card } from "@workday/canvas-kit-react/card";
import { colors, space, type } from "@workday/canvas-kit-react/tokens";
import { Layout } from "@workday/canvas-kit-react/layout";
import { AppletIcon } from "@workday/canvas-kit-react/icon";
import { fallbackIcon, recentSignOnsIcon, workerSpendIcon } from '@workday/canvas-applet-icons-web';

import PageHeader from './PageHeader';

const Home = () => {
  return (
    <React.Fragment>
      <PageHeader title="Home" />
      <CardLayout>
          <CardLink to='/spot-bonus'>
            <HomeCard depth={2}>
              <Card.Body>
                <AppletIcon icon={workerSpendIcon} />
                <CardHeader>Spot Bonus</CardHeader>
                <CardDescription>Give One-Time Payments and Anytime Feedback to your workers on demand.</CardDescription>
              </Card.Body>
            </HomeCard>
          </CardLink>
          <CardLink to='/badge-generator'>
            <HomeCard depth={2}>
              <Card.Body>
                <AppletIcon icon={recentSignOnsIcon} />
                <CardHeader>Badge Generator</CardHeader>
                <CardDescription>Generate a Worker Badge image and store in Workday.</CardDescription>
              </Card.Body>
            </HomeCard>
          </CardLink>
          <HomeCardComingSoon depth={2}>
            <Card.Body>
              <AppletIcon icon={fallbackIcon} />
              <CardHeader>Coming Soon</CardHeader>
              <CardDescription>Build the next big thing!</CardDescription>
            </Card.Body>
          </HomeCardComingSoon>
      </CardLayout>
    </React.Fragment>
  );
};

const CardLayout = styled(Layout) ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  padding: space.l,
  marginTop: space.l
});

const CardDescription = styled("p") ({
  ...type.levels.subtext.large
});

const CardHeader = styled("h2") ({
  ...type.levels.heading.small
});


const CardLink = styled(Link) ({
  textDecoration: "none"
});

const HomeCard = styled(Card) ({
  alignItems: "center",
  display: "flex",
  height: "250px",
  justifyContent: "center",
  marginBottom: space.l,
  marginRight: space.l,
  padding: space.l,
  textAlign: "center",
  width: "450px",
  [`&:hover`]: {
    backgroundColor: colors.soap100
  }
});

const HomeCardComingSoon = styled(HomeCard) ({
  backgroundColor: `${colors.soap100} !important`
});

export default Home;
