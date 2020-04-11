export const TYPE = {
  NEEDS_VERIFICATION: CARD_STATUS.NEEDS_VERIFICATION,
  OUT_OF_DATE: CARD_STATUS.OUT_OF_DATE,
  UNDOCUMENTED: CARD_STATUS.NOT_DOCUMENTED,
  NEEDS_APPROVAL: CARD_STATUS.NEEDS_APPROVAL,
};

export const TAB_OPTIONS = ['Unresolved', 'Needs Approval'];

export const SECTION_TYPE = {
  ALL: 'ALL',
  NEEDS_VERIFICATION: 'NEEDS_VERIFICATION',
  OUT_OF_DATE: 'OUT_OF_DATE',
  UNDOCUMENTED: 'UNDOCUMENTED',
  NEEDS_APPROVAL: 'NEEDS_APPROVAL',
};

export const SECTIONS = [
  {
    type: SECTION_TYPE.ALL,
    title: 'All Tasks',
    taskTypes: [TYPE.NEEDS_VERIFICATION, TYPE.OUT_OF_DATE, TYPE.UNDOCUMENTED]
  },
  {
    type: SECTION_TYPE.NEEDS_VERIFICATION,
    title: 'Needs Verification',
    taskTypes: [TYPE.NEEDS_VERIFICATION]
  },
  {
    type: SECTION_TYPE.OUT_OF_DATE,
    title: 'Out of Date',
    taskTypes: [TYPE.OUT_OF_DATE]
  },
  {
    type: SECTION_TYPE.UNDOCUMENTED,
    title: 'Undocumented Questions',
    taskTypes: [TYPE.UNDOCUMENTED]
  },
];