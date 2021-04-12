
import { _decorator } from 'cc';
import { RootDataCollector } from './rootDataCollector';
const { ccclass } = _decorator;

@ccclass('InputController')
export class InputController extends RootDataCollector {

  public get appSettingsNode() {
    return this.rootConfig.appSettingsNode;
  }

  public get appSettings() {
    return this.rootConfig.appSettings;
  }

}