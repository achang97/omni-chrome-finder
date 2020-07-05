// Card page constants
export const DIMENSIONS = {
  DEFAULT_CARDS_WIDTH: 660,
  DEFAULT_CARDS_HEIGHT: 500
};

export const HINTS = {
  OWNERS:
    'Owners are in charge of the knowledge in this card and will be tasked to keep it updated over time.',
  SUBSCRIBERS: 'Subscribers will be notified when this card is created or changed.',
  VERIFICATION_INTERVAL:
    'Interval at which we remind owners to verify the information on this card is up-to-date.'
};

export const MODAL_TYPE = {
  CREATE: 'CREATE',
  THREAD: 'THREAD',
  SELECT_THREAD: 'SELECT_THREAD',
  INVITE_USER: 'INVITE_USER',
  ERROR_UPDATE: 'ERROR_UPDATE',
  ERROR_UPDATE_CLOSE: 'ERROR_UPDATE_CLOSE',
  ERROR_DELETE: 'ERROR_DELETE',
  ERROR_ARCHIVE: 'ERROR_ARCHIVE',
  CONFIRM_CLOSE: 'CONFIRM_CLOSE',
  CONFIRM_CLOSE_UNDOCUMENTED: 'CONFIRM_CLOSE_UNDOCUMENTED',
  CONFIRM_UP_TO_DATE: 'CONFIRM_UP_TO_DATE',
  CONFIRM_OUT_OF_DATE: 'CONFIRM_OUT_OF_DATE',
  CONFIRM_UP_TO_DATE_SAVE: 'CONFIRM_UP_TO_DATE_SAVE',
  CONFIRM_APPROVE: 'CONFIRM_APPROVE',
  CONFIRM_DELETE: 'CONFIRM_DELETE',
  CONFIRM_ARCHIVE: 'CONFIRM_ARCHIVE',
  CONFIRM_CLOSE_EDIT: 'CONFIRM_CLOSE_EDIT',
  CONFIRM_CLOSE_ALL: 'CONFIRM_CLOSE_ALL',
  FINDER: 'FINDER'
};

export const STATUS = {
  UP_TO_DATE: 1,
  OUT_OF_DATE: 2,
  NEEDS_VERIFICATION: 3,
  NEEDS_APPROVAL: 4,
  NOT_DOCUMENTED: 5,
  ARCHIVED: 6
};

export const STATUS_NAME = {
  [STATUS.NEEDS_APPROVAL]: 'Needs Approval',
  [STATUS.NOT_DOCUMENTED]: 'Not Documented',
  [STATUS.NEEDS_VERIFICATION]: 'Needs Verification',
  [STATUS.OUT_OF_DATE]: 'Out of Date',
  [STATUS.UP_TO_DATE]: 'Up to Date',
  [STATUS.ARCHIVED]: 'Archived'
};

export const VERIFICATION_INTERVAL_OPTION = {
  TWO_WEEKS: 1,
  ONE_MONTH: 2,
  THREE_MONTHS: 3,
  SIX_MONTHS: 4,
  ONE_YEAR: 5,
  AUTOREMIND: 6,
  NEVER: 7,
  ONE_DAY: 8,
  ONE_WEEK: 9
};

export const VERIFICATION_INTERVAL_OPTIONS = [
  // { label: 'Auto-Remind', value: 6 },
  { label: '1 Day', value: VERIFICATION_INTERVAL_OPTION.ONE_DAY },
  { label: '1 Week', value: VERIFICATION_INTERVAL_OPTION.ONE_WEEK },
  { label: '2 Weeks', value: VERIFICATION_INTERVAL_OPTION.TWO_WEEKS },
  { label: '1 Month', value: VERIFICATION_INTERVAL_OPTION.ONE_MONTH },
  { label: '3 Months', value: VERIFICATION_INTERVAL_OPTION.THREE_MONTHS },
  { label: '6 Months', value: VERIFICATION_INTERVAL_OPTION.SIX_MONTHS },
  { label: '1 Year', value: VERIFICATION_INTERVAL_OPTION.ONE_YEAR },
  { label: 'Never', value: VERIFICATION_INTERVAL_OPTION.NEVER }
];
export const DEFAULT_VERIFICATION_INTERVAL = VERIFICATION_INTERVAL_OPTIONS[3];

export const PERMISSION_OPTION = {
  ANYONE: 'ANYONE',
  JUST_ME: 'JUST_ME',
  SPECIFIC_GROUPS: 'SPECIFIC_GROUPS'
};
export const PERMISSION_OPTIONS = [
  { label: 'Anyone', value: PERMISSION_OPTION.ANYONE },
  { label: 'Just Me', value: PERMISSION_OPTION.JUST_ME },
  { label: 'Specific Groups', value: PERMISSION_OPTION.SPECIFIC_GROUPS }
];

export const INVITE_TYPE = {
  ADD_CARD_OWNER: 'addCardOwner',
  ADD_CARD_SUBSCRIBER: 'addCardSubscriber'
};

export default {
  DIMENSIONS,
  HINTS,
  MODAL_TYPE,
  STATUS,
  STATUS_NAME,
  VERIFICATION_INTERVAL_OPTION,
  VERIFICATION_INTERVAL_OPTIONS,
  DEFAULT_VERIFICATION_INTERVAL,
  PERMISSION_OPTION,
  PERMISSION_OPTIONS,
  INVITE_TYPE
};
