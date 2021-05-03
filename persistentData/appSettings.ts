// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec2 } from 'cc';
import ComplexPayload from '../complexPayload';
import InputGroup from './inputGroup';
import UserPreferences from './userPreferences';
const { ccclass, property, executionOrder } = _decorator;

@ccclass('AppSettings')
@executionOrder(-1)
export default class AppSettings extends Component {

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


  // Is Reversing

  getIsReversing(callingObject: Node) {
    return this.inputGroup.isReversing;
  }

  setIsReversing(callingObject: Node, targetValue: boolean) {
    this.inputGroup.isReversing = targetValue;
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