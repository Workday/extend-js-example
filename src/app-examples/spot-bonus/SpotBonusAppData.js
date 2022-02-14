import { executeRequest, HttpMethod } from '../../common/wcp/WcpRequest';

const SPOT_BONUS_APP_ID = process.env.REACT_APP_EXTEND_APP_REFERENCE_ID_SPOT_BONUS;
const SPOT_BONUS_ORCHESTRATION_ID = "OneTimePaymentWithFeedback";

export const getFeedbackBadges = async() => {
  return executeRequest(HttpMethod.GET, 'performanceEnablement/v3/feedbackBadges');
};

export const getPositionsForWorker = async(workerId) => {
  return executeRequest(HttpMethod.GET, `compensation/v2/workers/${workerId}/requestOneTimePayment/values/position`);
};

export const getWorkerDirectReports = async(workerId) => {
  return executeRequest(HttpMethod.GET, `common/v1/workers/${workerId}/directReports`);
};

export const launchSpotBonusOrchestration = async(spotBonusData) => {
  return executeRequest(
    HttpMethod.POST, 
    `orchestrate/v1/apps/${SPOT_BONUS_APP_ID}/orchestrations/${SPOT_BONUS_ORCHESTRATION_ID}/launch`, 
    null, 
    JSON.stringify(spotBonusData));
};