
import { _decorator } from 'cc';
import { DESTINATION_TYPE } from '../constants';
import SequenceController from './sequenceController';

export interface IForkDestinationPayload {
  sequence: SequenceController;
  branchKey: string;
  destinationType: DESTINATION_TYPE;
}
