// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, Vec2 } from 'cc';
import ComplexPayload from '../complexPayload';
import InputSettings from './inputSettings';
const { ccclass, property } = _decorator;

@ccclass('AppSettings')
export default class AppSettings extends Component {

  @property({type: InputSettings})
  public inputSettings: InputSettings = null!;

  @property({visible: true})
  private _debug: Boolean = false;
  public get debug() {
    return this._debug;
  }
  public set debug(value: Boolean) {
    this._debug = value;
  }

  getSwipeForce(callingObject: Node) {
    return this.inputSettings.swipeForce;
  }

  setSwipeForce(callingObject: Node, targetValue: Vec2) {
    return this.inputSettings.swipeForce;
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

  // @property
  // public swipeForce = v2(0,0);

  // start () {
  //     // Your initialization goes here.
  // }

  // update (deltaTime: number) {
  //     // Your update function goes here.
  // }
}