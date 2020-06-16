import _ from 'lodash';
import { AUDIT } from './profile';

export const SOURCE = {
  ..._.pickBy(AUDIT.SOURCE, (value) => [AUDIT.SOURCE.DOCK, AUDIT.SOURCE.SEGMENT].includes(value)),
  AUTOFIND: 'autofind'
};

export const PAGE_SIZE = 20;

export default { SOURCE, PAGE_SIZE };
