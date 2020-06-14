import _ from 'lodash';
import { SOURCE as ALL_SOURCES } from './general';

export const SOURCE = {
  ..._.pickBy(ALL_SOURCES, (value) => [ALL_SOURCES.DOCK, ALL_SOURCES.SEGMENT].includes(value)),
  AUTOFIND: 'autofind'
};

export const PAGE_SIZE = 20;

export default { SOURCE, PAGE_SIZE };
