import _ from 'lodash';
import { INTEGRATIONS as ALL_INTEGRATIONS } from './general';
import AUDIT from './audit';

export const SOURCE = {
  ..._.pickBy(AUDIT.SOURCE, (value) => [AUDIT.SOURCE.DOCK, AUDIT.SOURCE.SEGMENT].includes(value)),
  AUTOFIND: 'autofind'
};

export const INTEGRATIONS = [
  ALL_INTEGRATIONS.CONFLUENCE,
  ALL_INTEGRATIONS.ZENDESK,
  ALL_INTEGRATIONS.GOOGLE,
  ALL_INTEGRATIONS.SLACK,
  ALL_INTEGRATIONS.JIRA
];

export const PAGE_SIZE = 20;

export default { SOURCE, PAGE_SIZE, INTEGRATIONS };
