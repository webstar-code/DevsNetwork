import { IFAILURE_RESPONSE, ISUCCESS_RESPONSE } from './types';

export const RESPONSE_STATUS = {
  success: 'success',
  failed: 'failed'
} as const;

export const SUCCESS_RESPONSE = <T>({ status, data, message }: ISUCCESS_RESPONSE<T>) => {
  return { status, data, message };
};

export const FAILURE_RESPONSE = ({ status, message }: IFAILURE_RESPONSE) => {
  return { status, message };
};