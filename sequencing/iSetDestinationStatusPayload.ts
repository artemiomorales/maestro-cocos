
import { _decorator } from 'cc';
import SequenceController from './sequenceController';

export interface ISetDestinationStatusPayload {
  sequence: SequenceController;
  targetStatus: boolean;
}
