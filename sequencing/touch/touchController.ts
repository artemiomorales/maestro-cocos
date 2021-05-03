
import { Component, _decorator } from 'cc';
import { InputController } from '../inputController';
import { RootConfig } from '../rootConfig';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('TouchController')
@executionOrder(10)
export default class TouchController extends Component implements InputController {

  @property({type: RootConfig, visible: true})
  private _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }
  
  public get appSettingsNode() {
    return this._rootConfig.appSettingsNode;
  }

  public get appSettings() {
    return this._rootConfig.appSettings;
  }

  public get masterSequences() {
    return this._rootConfig.masterSequences;
  }

  public get swipeForce() {
    return this.appSettings.getSwipeForce(this.node);
  }

  public get swipeDirection() {
    return this.appSettings.getSwipeDirection(this.node);
  }

  public get swipeModifierOutput() {
    return this.appSettings.getSwipeModifierOutput(this.node);
  }
  public set swipeModifierOutput(value: number) {
    this.appSettings.setSwipeModifierOutput(this.node, value);
  }

  public get momentumModifierOutput() {
    return this.appSettings.getMomentumModifierOutput(this.node);
  }
  public set momentumModifierOutput(value: number) {
    this.appSettings.setMomentumModifierOutput(this.node, value);
  }

  public get isReversing() {
    return this.appSettings.getIsReversing(this.node);
  }
  public set isReversing(value: boolean) {
    this.appSettings.setIsReversing(this.node, value);
  }

  configureData() { } 

}