import { ResponseStatus } from '../enums/response-status.enum';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  totalCount?: number;
  status: ResponseStatus;
}
