// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec2, TextAsset } from 'cc';
import ComplexPayload from '../complexPayload';
import { AppSettingsVariableReference } from './appSettingsVariableReference';
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

  // User Preferences ///


  // Y Sensitivity

  getYSensitivity(callingObject: Node) {
    return this.userPreferences.ySensitivity;
  }

  setYSensitivity(callingObject: Node, targetValue: number) {
    this.userPreferences.ySensitivity = targetValue;
  }

  // Invert Y Input

  getInverYInput(callingObject: Node) {
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

  getInverXInput(callingObject: Node) {
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