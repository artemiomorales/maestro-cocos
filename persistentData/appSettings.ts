// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec2, TextAsset } from 'cc';
import ComplexPayload from '../complexPayload';
import { BoolVariable } from './boolVariable';
import InputGroup from './inputGroup';
import SystemSettings from './systemSettings';
import UserPreferences from './userPreferences';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('AppSettings')
@executionOrder(-1)
export default class AppSettings extends Component {

  @property({type: SystemSettings, visible: true})
  public _systemSettings: SystemSettings = null!;
  public get systemSettings() {
    return this._systemSettings;
  }
  public set systemSettings(value: SystemSettings) {
    this._systemSettings = value;
  }

  @property({type: InputGroup, visible: true})
  public _inputGroup: InputGroup = null!;
  public get inputGroup() {
    return this._inputGroup;
  }
  public set inputGroup(value: InputGroup) {
    this._inputGroup = value;
  }

  @property({type: UserPreferences, visible: true})
  public _userPreferences: UserPreferences = null!;
  public get userPreferences() {
    return this._userPreferences;
  }
  public set userPreferences(value: UserPreferences) {
    this._userPreferences = value;
  }

  @property({visible: true})
  private _debug: Boolean = false;
  public get debug() {
    return this._debug;
  }
  public set debug(value: Boolean) {
    this._debug = value;
  }

  start() {
    this.systemSettings.initialize();
    this.inputGroup.initialize();
  }

  getValueViaVariableKey(callingObject: Node, variableKey: TextAsset) {
    console.log(callingObject.name + " requesting " + variableKey.name);
    console.log(variableKey);
    console.log(this.systemSettings.variableMap);
    if(variableKey.name in this.systemSettings.variableMap) {
      return this.systemSettings.variableMap[variableKey.name].getValue();
    }
    if(variableKey.name in this.inputGroup.variableMap) {
      return this.inputGroup.variableMap[variableKey.name].getValue();
    }
  }

  setValueViaVariableKey(callingObject: Node, variableKey: TextAsset, targetValue: any) {
    console.log(variableKey);
    if(variableKey.name in this.systemSettings.variableMap) {
      const newValue = this.systemSettings.variableMap[variableKey.name].setValue(targetValue);
      this.triggerSimpleEvent(callingObject, variableKey.name);
      return newValue;
    }
    if(variableKey.name in this.inputGroup.variableMap) {
      const newValue = this.inputGroup.variableMap[variableKey.name].setValue(targetValue);
      this.triggerSimpleEvent(callingObject, variableKey.name);
      return newValue;
    }
  }

  setDefaultValueViaVariableKey(callingObject: Node, variableKey: TextAsset) {
    console.log(variableKey);
    console.log(this.inputGroup.variableMap);
    if(variableKey.name in this.systemSettings.variableMap) {
      const newValue = this.systemSettings.variableMap[variableKey.name].setToDefaultValue();
      this.triggerSimpleEvent(callingObject, variableKey.name);
      return newValue;
    }
    if(variableKey.name in this.inputGroup.variableMap) {
      const newValue = this.inputGroup.variableMap[variableKey.name].setToDefaultValue();
      this.triggerSimpleEvent(callingObject, variableKey.name);
      return newValue;
    }
  }

  /// System Settings ///

  getAppUtilsRequested(callingObject: Node) {
    return this.systemSettings.appUtilsRequested.getValue();
  }

  setAppUtilsRequested(callingObject: Node, targetValue: boolean) {
    const newValue = this.systemSettings.appUtilsRequested.setValue(targetValue);
    this.triggerSimpleEvent(callingObject, this.systemSettings.appUtilsRequested.variableKey.name);
    return newValue;
  }

  getProgressBarVisible(callingObject: Node) {
    return this.systemSettings.progressBarVisible.getValue();
  }

  setProgressBarVisible(callingObject: Node, targetValue: boolean) {
    const newValue = this.systemSettings.progressBarVisible.setValue(targetValue);
    this.triggerSimpleEvent(callingObject, this.systemSettings.progressBarVisible.variableKey.name);
    return newValue;
  }

  getSceneLoadingProgress(callingObject: Node) {
    return this.systemSettings.sceneLoadingProgress.getValue();
  }

  getSceneLoadingProgressVariableKey(callingObject: Node) {
    return this.systemSettings.sceneLoadingProgress.variableKey.name;
  }

  setSceneLoadingProgress(callingObject: Node, targetValue: number) {
    const newValue = this.systemSettings.sceneLoadingProgress.setValue(targetValue);
    this.triggerSimpleEvent(callingObject, this.systemSettings.sceneLoadingProgress.variableKey.name);
    return newValue;
  }

  // Touch Branch Keys

  getYNorthBranchKey(callingObject: Node) {
    return this.systemSettings.yNorthKey.variableReference;
  }

  getYSouthBranchKey(callingObject: Node) {
    return this.systemSettings.ySouthKey.variableReference;
  }

  getXWestBranchKey(callingObject: Node) {
    return this.systemSettings.xWestKey.variableReference;
  }

  getXEastBranchKey(callingObject: Node) {
    return this.systemSettings.xEastKey.variableReference;
  }

  getTouchBranchKeys(callingObject: Node) {
    return this.systemSettings.touchBranchKeys;
  }


  /// User Preferences ///


  // Y Sensitivity

  getYSensitivity(callingObject: Node) {
    return this.userPreferences.ySensitivity;
  }

  setYSensitivity(callingObject: Node, targetValue: number) {
    this.userPreferences.ySensitivity = targetValue;
  }

  // Invert Y Input

  getInvertYInput(callingObject: Node) {
    return this.userPreferences.invertYInput;
  }

  setInverYInput(callingObject: Node, targetValue: boolean) {
    this.userPreferences.invertYInput = targetValue;
  }

  // X Sensitivity

  getXSensitivity(callingObject: Node) {
    return this.userPreferences.xSensitivity;
  }

  setXSensitivity(callingObject: Node, targetValue: number) {
    this.userPreferences.xSensitivity = targetValue;
  }

  // Invert X Input

  getInvertXInput(callingObject: Node) {
    return this.userPreferences.invertXInput;
  }

  setInverXInput(callingObject: Node, targetValue: boolean) {
    this.userPreferences.invertXInput = targetValue;
  }



  // Input Group ///


  // Is Touching

  getIsTouching(callingObject: Node) {
    return this.inputGroup.isTouching;
  }

  setIsTouching(callingObject: Node, targetValue: boolean) {
    this.inputGroup.isTouching = targetValue;
  }

  // Is Swiping

  getIsSwiping(callingObject: Node) {
    return this.inputGroup.isSwiping;
  }

  setIsSwiping(callingObject: Node, targetValue: boolean) {
    this.inputGroup.isSwiping = targetValue;
  }


  // Swipe Force

  getSwipeForce(callingObject: Node) {
    return this.inputGroup.swipeForce;
  }

  setSwipeForce(callingObject: Node, targetValue: Vec2) {
    this.inputGroup.swipeForce = targetValue;
  }


  // Swipe Direction

  getSwipeDirection(callingObject: Node) {
    return this.inputGroup.swipeDirection;
  }

  setSwipeDirection(callingObject: Node, targetValue: string) {
    this.inputGroup.swipeDirection = targetValue;
  }


  // Touch Monitor Momentum

  getTouchMonitorMomentum(callingObject: Node) {
    return this.inputGroup.touchMonitorMomentum;
  }

  setTouchMonitorMomentum(callingObject: Node, targetValue: Vec2) {
    this.inputGroup.touchMonitorMomentum = targetValue;
  }

  // Touch Monitor Momentum

  getTouchMonitorMomentumCache(callingObject: Node) {
    return this.inputGroup.touchMonitorMomentumCache;
  }

  setTouchMonitorMomentumCache(callingObject: Node, targetValue: Vec2) {
    this.inputGroup.touchMonitorMomentumCache = targetValue;
  }

  // Axis Transition Active

  getAxisTransitionActive(callingObject: Node) {
    return this.inputGroup.axisTransitionActive;
  }

  setAxisTransitionActive(callingObject: Node, targetValue: boolean) {
    this.inputGroup.axisTransitionActive = targetValue;
  }

  // Axis Transition Spread

  getAxisTransitionSpread(callingObject: Node) {
    return this.inputGroup.axisTransitionSpread;
  }

  setAxisTransitionSpread(callingObject: Node, targetValue: number) {
    this.inputGroup.axisTransitionSpread = targetValue;
  }

  // Fork Transition Active

  getForkTransitionActive(callingObject: Node) {
    return this.inputGroup.forkTransitionActive;
  }

  setForkTransitionActive(callingObject: Node, targetValue: boolean) {
    this.inputGroup.forkTransitionActive = targetValue;
  }

  // Fork Transition Spread

  getForkTransitionSpread(callingObject: Node) {
    return this.inputGroup.forkTransitionSpread;
  }

  setForkTransitionSpread(callingObject: Node, targetValue: number) {
    this.inputGroup.forkTransitionSpread = targetValue;
  }

  // Swipe Modifer Output

  getSwipeModifierOutput(callingObject: Node) {
    return this.inputGroup.swipeModifierOutput;
  }

  setSwipeModifierOutput(callingObject: Node, targetValue: number) {
    this.inputGroup.swipeModifierOutput = targetValue;
  }


  // Momentum Modifer Output

  getMomentumModifierOutput(callingObject: Node) {
    return this.inputGroup.momentumModifierOutput;
  }

  setMomentumModifierOutput(callingObject: Node, targetValue: number) {
    this.inputGroup.momentumModifierOutput = targetValue;
  }


  // Y Axes

  getYSwipeAxisReference(callingObject: Node)
  {
    return this.inputGroup.ySwipeAxis;
  }

  getYMomentumAxisReference(callingObject: Node)
  {
    return this.inputGroup.yMomentumAxis;
  }
  
  
  // X Axes

  getXSwipeAxisReference(callingObject: Node)
  {
    return this.inputGroup.xSwipeAxis;
  }

  getXMomentumAxisReference(callingObject: Node)
  {
    return this.inputGroup.xMomentumAxis;
  }


  // Momentum Decay

  getMomentumDecay(callingObject: Node) {
    return this.inputGroup.momentumDecay;
  }

  setMomentumDecay(callingObject: Node, targetValue: number) {
    this.inputGroup.momentumDecay = targetValue;
  }


  // Frame Step Value
        
  getFrameStepValue(callingObject: Node)
  {
    return this.inputGroup.frameStepValue;
  }

  // Autorun Threshold
        
  getAutorunThreshold(callingObject: Node)
  {
    return this.inputGroup.autorunThreshold;
  }

  // Is Reversing

  getIsReversing(callingObject: Node): boolean {
    return this.inputGroup.isReversing.getValue();
  }

  setIsReversing(callingObject: Node, targetValue: boolean): BoolVariable {
    const newValue = this.inputGroup.isReversing.setValue(targetValue);
    this.triggerSimpleEvent(callingObject, this.inputGroup.isReversing.variableKey.name);
    return newValue;
  }


  triggerSimpleEvent(callingObject: Node, targetEvent: string) {
    if(this.debug === true) {
      console.log("Simple Event triggered: " + targetEvent);
      console.log("Calling object: " + callingObject.name);
      console.log("-----------------------")
    }
    this.node.emit(targetEvent);
  }

  triggerComplexEvent(callingObject: Node, targetEvent: string, complexPayload: ComplexPayload) {
    if(this.debug === true) {
      console.log("Complex Event triggered: " + targetEvent);
      console.log("Calling object: " + callingObject.name);
      console.log("Arguments: " + complexPayload);
      console.log("-----------------------")
    }
    this.node.emit(targetEvent, complexPayload);
  }
  
  // @property
  // public swipeDirection = "";


  // start () {
  //     // Your initialization goes here.
  // }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}