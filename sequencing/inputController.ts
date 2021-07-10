
import { Node } from 'cc';
import AppSettings from '../persistentData/appSettings';
import Joiner from './joiner';
import { RootDataCollector } from './rootDataCollector';

export interface InputController extends RootDataCollector {
  appSettingsNode: Node;
  appSettings: AppSettings;
}