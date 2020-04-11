import { INTEGRATIONS as ALL_INTEGRATIONS } from './general';

export const INTEGRATIONS = [
  ALL_INTEGRATIONS.SLACK,
  { ...ALL_INTEGRATIONS.GMAIL, disabled: true }
];

export const SLACK_RECIPIENT_TYPE = {
  CHANNEL: 'channel',
  USER: 'user',
};