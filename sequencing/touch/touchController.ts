
import { Component, find, Node, _decorator, Vec2 } from 'cc';
import { CONSTANTS, SIMPLE_EVENT, SWIPE_DIRECTION } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import { Axis } from '../../persistentData/axis';
import { InputController } from '../inputController';
import Joiner from '../joiner';
import { RootConfig } from '../rootConfig';
import { TouchData } from './touchData';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('TouchController')
@executionOrder(10)
export default class TouchController extends Component implements InputController {

  public appSettingsNode: Node = null!;
  public appSettings: AppSettings = null!;

  @property({type: RootConfig, visible: true})
  private _rootConfig: RootConfig = null!;
  public get rootConfig() {
    return this._rootConfig;
  }
  public set rootConfig(value: RootConfig) {
    this._rootConfig = value;
  }

  @property({type: Joiner, visible: true})
  private _joiner: Joiner = null!;
  public get joiner() {
    return this._joiner;
  }
  public set joiner(value: Joiner) {
    this._joiner = value;
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

  public get ySwipeAxis() {
    return this.appSettings.getYSwipeAxisReference(this.node);
  }

  public get xSwipeAxis() {
    return this.appSettings.getXSwipeAxisReference(this.node);
  }

  public get yMomentumAxis() {
    return this.appSettings.getYMomentumAxisReference(this.node);
  }

  public get xMomentumAxis() {
    return this.appSettings.getXMomentumAxisReference(this.node);
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

  private _touchDataList: TouchData[] = null!;
  public get touchDataList() {
    return this._touchDataList;
  }
  public set touchDataList(value: TouchData[]) {
    this._touchDataList = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE], this.configureData, this);
  }

  onDisable () {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SEQUENCE_CONFIGURATION_COMPLETE], this.configureData, this);
  }

  configureData()
  {
    this.touchDataList = [];

    for (let i = 0; i < this.masterSequences.length; i++)
    {
      for (let q = 0; q < this.masterSequences[i].sequenceControllers.length; q++)
      {
        var sequence = this.masterSequences[i].sequenceControllers[q];
        this.touchDataList.push(TouchData.createInstance(sequence));
      }
    }

    this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TOUCH_CONTROLLER_CONFIGURATION_COMPLETE]);
  }

  getDominantTouchForce(vector2: Vec2)
  {
    if (this.swipeDirection == SWIPE_DIRECTION.xPositive ||
      this.swipeDirection == SWIPE_DIRECTION.xNegative) {
      return new Vec2(vector2.x, 0);
    }
    
    return new Vec2(0, vector2.y);
  }

  static refreshIsReversing(touchController: TouchController, swipeDirection: string, sourceAxis: Axis) : TouchController
  {
      switch (swipeDirection) {
          
          case SWIPE_DIRECTION.yPositive:
          case SWIPE_DIRECTION.xPositive:
          {
              if (sourceAxis.inverted == false) {
                  touchController.isReversing = false;
              }
              else {
                  touchController.isReversing = true;
              }

              break;
          }
          case SWIPE_DIRECTION.yNegative:
          case SWIPE_DIRECTION.xNegative:
          {
              if (sourceAxis.inverted == false) {
                  touchController.isReversing = true;
              }
              else {
                  touchController.isReversing = false;
              }

              break;
          }
          
          default:
              throw `${swipeDirection} is invalid`;
      }

      return touchController;
  }

}