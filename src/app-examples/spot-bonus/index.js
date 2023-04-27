import React, { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

import { ActionBar } from "@workday/canvas-kit-react/action-bar";
import { PrimaryButton } from "@workday/canvas-kit-react/button";
import { colors, space, type } from "@workday/canvas-kit-react/tokens";
import FormField from "@workday/canvas-kit-react/form-field";
import { Layout } from "@workday/canvas-kit-react/layout";
import { LoadingDots } from "@workday/canvas-kit-react/loading-animation";
import { Popper } from "@workday/canvas-kit-react/popup";
import { Radio, RadioGroup } from "@workday/canvas-kit-react/radio";
import Select from "@workday/canvas-kit-preview-react/select";
import { Switch } from "@workday/canvas-kit-react/switch";
import TextArea from "@workday/canvas-kit-react/text-area";
import { Toast } from "@workday/canvas-kit-react/toast";
import { Tooltip } from "@workday/canvas-kit-react/tooltip";
import { exclamationCircleIcon } from '@workday/canvas-system-icons-web';

import PageHeader from '../../common/components/PageHeader';

import { getFeedbackBadges, getPositionsForWorker, getWorkerDirectReports, launchSpotBonusOrchestration } from './SpotBonusAppData';

/* 
Give a Spot Bonus (One-Time Payment) with Anytime Feedback to your direct report(s). 
This example is for demo purposes and is not officially supported by Workday.
*/
const SpotBonus = () => {
  const DEFAULT_ONE_TIME_PAYMENT_PLAN_ID = "One-Time_Payment_Plan_ID=SPOT_BONUS";
  const DEFAULT_CURRENCY = "USD";

  const today = new Date().toISOString().split('T')[0];
  const toastsAnchorRef = useRef();

  const [feedbackBadges, setFeedbackBadges] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isPageSubmitDisabled, setIsPageSubmitDisabled] = useState(false);
  const [inputBonusAmount, setInputBonusAmount] = useState(100);
  const [inputDisplayNameOnFeedback, setInputDisplayNameOnFeedback] = useState(true);
  const [inputFeedback, setInputFeedback] = useState('You did a great job!');
  const [inputFeedbackBadge, setInputFeedbackBadge] = useState('');
  const [inputEffectiveDate, setInputEffectiveDate] = useState(today);
  const [inputWorker, setInputWorker] = useState();
  const [inputWorkerPosition, setInputWorkerPosition] = useState();
  const [positionsForWorker, setPositionsForWorker] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    setIsPageLoading(true);
    fetchDirectReports()
      .then(() => fetchFeedbackBadges())
      .catch((error) => {
        console.error(error);
        setToasts([{ key: Date.now(), icon: exclamationCircleIcon, color: colors.cinnamon500, text: `Problem Retrieving Data: ${error.message}` }]);
      })
      .finally(() => setIsPageLoading(false));
  }, []);

  useEffect(() => {
    if (inputWorker) {
      fetchPositionsForWorker(inputWorker)
        .catch((error) => {
          console.error(error);
          setToasts([{ key: Date.now(), icon: exclamationCircleIcon, color: colors.cinnamon500, text: `Problem Retrieving Data: ${error.message}` }]);
        });
    }
  }, [inputWorker]);

  const fetchFeedbackBadges = async() => {
    const fetchedFeedbackBadges = [];

    const feedbackBadges = await getFeedbackBadges();
    if (feedbackBadges.data) {
      feedbackBadges.data.forEach(result => {
        fetchedFeedbackBadges.push({
          value: result.workdayID,
          display: result.name
        });
      });

      setFeedbackBadges(fetchedFeedbackBadges);
      setInputFeedbackBadge(fetchedFeedbackBadges[0].value);
    }
    else {
      throw new Error(feedbackBadges.error);
    }
  };

  const fetchPositionsForWorker = async(workerId) => {
    const positions = [];

    const fetchedPositions = await getPositionsForWorker(workerId);
      if (fetchedPositions.data) {
        fetchedPositions.data.forEach(result => {
          positions.push({
            value: result.id,
            display: result.descriptor
          });
        });

        setPositionsForWorker(positions);
        setInputWorkerPosition(positions[0].value);
      }
      else {
        throw new Error(fetchedPositions.error);
      }
  };

  const fetchDirectReports = async() => {
    const directReports = [];

    const workerDirectReports = await getWorkerDirectReports('me');
    if (workerDirectReports.data) {
      workerDirectReports.data.forEach(result => {
        directReports.push({
          value: result.id,
          display: result.descriptor
        });
      });

      setWorkers(directReports);
      setInputWorker(directReports[0].value);
    }
    else {
      throw new Error(workerDirectReports.error);
    }
  };

  const submitSpotBonus = async() => {
    const toastsList = [...toasts];
    
    const orchestrationRequestBody = {
      oneTimePaymentData: {
        effectiveDate: inputEffectiveDate,
        planId: DEFAULT_ONE_TIME_PAYMENT_PLAN_ID,
        planIdType: "WID",
        amount: parseInt(inputBonusAmount),
        currencyId: DEFAULT_CURRENCY,
        sendToPayroll: true
      },
      feedbackData: {
        badgeId: inputFeedbackBadge,
        comment: inputFeedback,
        showFeedbackProviderName: inputDisplayNameOnFeedback
      },
      workerId: inputWorker,
      workerIdType: "WID"
    };
    
    const triggerOrchestration = async() => {
      try {
        const orchestrationResult = await launchSpotBonusOrchestration(orchestrationRequestBody);
        if (orchestrationResult.errors) {
          throw new Error(JSON.stringify(orchestrationResult.errors));
        }
        toastsList.push({
          key: Date.now(),
          text: `One-Time Payment and Anytime Feedback orchestrated successfully!`
        });
      }
      catch(err) {
        console.error(err);
        toastsList.push({
          key: Date.now(),
          icon: exclamationCircleIcon,
          color: colors.cinnamon500,
          text: "There was a problem completing the orchestration. See Console for more details."
        });
      }
    };
    
    setIsPageSubmitDisabled(true);
    triggerOrchestration()
      .then(() => setToasts(toastsList))
      .finally(() => setIsPageSubmitDisabled(false));
  };

  return <>
    <PageHeader id="pageHeader" title="Spot Bonus" />

    <LayoutContainer ref={toastsAnchorRef}>
      <Popper placement="top" open={toasts.length > 0} anchorElement={toastsAnchorRef}>
        {toasts.map((toast) => <Toast key={toast.key} iconColor={toast.color} icon={toast.icon} onClose={() => setToasts(toasts.filter((t) => t.key !== toast.key))}>{toast.text} </Toast>)}
      </Popper>

      {isPageLoading ? <LoadingAnimation />
        :
        (
          <>
            <LayoutSectionTitle>Worker</LayoutSectionTitle>
            <Layout>
              <Layout.Column>
                <FormField label="Worker" inputId="inputWorker" required={true}>
                  <Select
                    id="inputWorker"
                    name="worker"
                    value={inputWorker}
                    onChange={event => setInputWorker(event.target.value)}
                    options={workers.map((worker) => { return { key: worker.value, value: worker.value, label: worker.display }; })} />
                </FormField>
              </Layout.Column>
              <Layout.Column>
                <FormField label="Position" inputId="inputPosition" required={true}>
                  <Select
                    id="inputPosition"
                    name="position"
                    value={inputWorkerPosition}
                    onChange={event => setInputWorkerPosition(event.target.value)}
                    options={positionsForWorker.map((position) => { return { key: position.value, value: position.value, label: position.display }; })}/>
                </FormField>
              </Layout.Column>
            </Layout>

            <LayoutSectionTitle>Award</LayoutSectionTitle>
            <Layout>
              <Layout.Column>
                <FormField label="Amount" inputId="inputAmount" required={true}>
                  <Select 
                    id="inputAmount" 
                    name="amount" 
                    value={inputBonusAmount} 
                    onChange={event => setInputBonusAmount(event.target.value)}
                    options={[
                    { key: "25", value: "25", label: "25" },
                    { key: "50", value: "50", label: "50" },
                    { key: "100", value: "100", label: "100" },
                    { key: "250", value: "250", label: "250" },
                    { key: "500", value: "500", label: "500" }
                    ]}/>
                </FormField>
              </Layout.Column>
              <Layout.Column>
                <FormField label="Date" inputId="inputEffectiveDate" required={true}>
                  <Tooltip id="inputEffectiveDate" type="describe" placement="bottom-start" title="The Spot Bonus will be paid to the worker on their first pay for this position occuring on or after this date.">
                    <input style={{ height: '38px' }} type="date" id="effectiveDate" name="effectiveDate" data-date-format="YYYY-MM-DD" value={inputEffectiveDate} onChange={event => setInputEffectiveDate(event.target.value)} />
                  </Tooltip>
                </FormField>
              </Layout.Column>
            </Layout>

            <LayoutSectionTitle>Feedback</LayoutSectionTitle>
            <Layout>
              <Layout.Column>
                <FormField label="Feedback" inputId="inputFeedback" required={true}>
                  <TextArea id="inputFeedback" value={inputFeedback} onChange={event => setInputFeedback(event.target.value)} />
                </FormField>
                <FormField label="Display Your Name on Feedback" inputId="inputDisplayNameOnFeedback" required={false}>
                  <Switch id="inputDisplayNameOnFeedback" checked={inputDisplayNameOnFeedback} onChange={event => setInputDisplayNameOnFeedback(event.target.checked)} />
                </FormField>
              </Layout.Column>
              <Layout.Column>
                <FormField label="Feedback Badge" inputId="inputFeedbackBadge" required={true}>
                  <RadioGroup name="feedbackBadges" value={inputFeedbackBadge}>
                    {feedbackBadges.map((badge) => <Radio id={badge.value} key={badge.value} value={badge.value} label={badge.display} onChange={event => setInputFeedbackBadge(event.target.value)} />)}
                  </RadioGroup>
                </FormField>
              </Layout.Column>
            </Layout>
          </>
        )}

      <ActionBar fixed={true}>
        <PrimaryButton
          disabled={isPageLoading || isPageSubmitDisabled}
          onClick={() => submitSpotBonus()}>Submit</PrimaryButton>
      </ActionBar>
    </LayoutContainer>
  </>;
};

const LoadingAnimation = styled(LoadingDots) ({
  left: "calc(50% - 38px)",
  position: "absolute",
  top: "50%"
});

const LayoutContainer = styled('div') ({
  marginLeft: space.m,
  marginRight: space.m,
  paddingBottom: space.xxl
});

const LayoutSectionTitle = styled('h2') ({
  ...type.levels.heading.small
});

export default SpotBonus;