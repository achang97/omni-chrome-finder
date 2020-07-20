import { STATUS } from './card';

export const TYPE = {
  NEEDS_VERIFICATION: STATUS.NEEDS_VERIFICATION,
  OUT_OF_DATE: STATUS.OUT_OF_DATE,
  NOT_DOCUMENTED: STATUS.NOT_DOCUMENTED,
  NEEDS_APPROVAL: STATUS.NEEDS_APPROVAL,
  SUBSCRIBER_CARD_CHANGE: 7,
  ADD_LISTENER: 8,
  ADD_UPVOTE: 9,
  REQUEST_EDIT_ACCESS: 10,
  EDIT_ACCESS_APPROVED: 11
};

export const TAB_OPTIONS = ['Unresolved', 'Needs Approval'];

export const SECTION_TYPE = {
  ALL: 'ALL',
  NEEDS_VERIFICATION: 'NEEDS_VERIFICATION',
  OUT_OF_DATE: 'OUT_OF_DATE',
  NOT_DOCUMENTED: 'NOT_DOCUMENTED',
  REQUEST_EDIT_ACCESS: 'REQUEST_EDIT_ACCESS',
  NEEDS_APPROVAL: 'NEEDS_APPROVAL'
};

export const SECTIONS = [
  {
    type: SECTION_TYPE.ALL,
    title: 'All Tasks',
    taskTypes: [
      TYPE.NEEDS_VERIFICATION,
      TYPE.OUT_OF_DATE,
      TYPE.NOT_DOCUMENTED,
      TYPE.REQUEST_EDIT_ACCESS
    ]
  },
  {
    type: SECTION_TYPE.NEEDS_VERIFICATION,
    title: 'Needs Verification',
    taskTypes: [TYPE.NEEDS_VERIFICATION]
  },
  {
    type: SECTION_TYPE.REQUEST_EDIT_ACCESS,
    title: 'Edit Access Requests',
    taskTypes: [TYPE.REQUEST_EDIT_ACCESS]
  },
  {
    type: SECTION_TYPE.OUT_OF_DATE,
    title: 'Out of Date',
    taskTypes: [TYPE.OUT_OF_DATE]
  },
  {
    type: SECTION_TYPE.NOT_DOCUMENTED,
    title: 'Undocumented Questions',
    taskTypes: [TYPE.NOT_DOCUMENTED]
  }
];

export default { TYPE, TAB_OPTIONS, SECTION_TYPE, SECTIONS };
