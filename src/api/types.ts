export interface ISUCCESS_RESPONSE<T> {
  status: 'success';
  data: T;
  message?: string;
}

export interface IFAILURE_RESPONSE {
  status: 'failed';
  message: string;
}