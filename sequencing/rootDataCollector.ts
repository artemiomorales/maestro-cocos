
import { _decorator } from 'cc';
import MasterSequence from './masterSequence';
import { RootConfig } from './rootConfig';

export interface RootDataCollector {
  rootConfig: RootConfig;
  masterSequences: MasterSequence[];
  configureData: Function;
}