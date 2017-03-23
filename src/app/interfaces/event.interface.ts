import { TObjectId } from './common.interface';

// experimental
export interface IEvent {
  type: string; // obligated. ex: 'PROCESS_COMPLETED'
  data: any; // experimental
}
