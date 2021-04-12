
import { _decorator, Component, Node, v2, Vec2, Vec3, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputGroup')
export default class InputGroup {

  @property({visible: true})
  private _isTouching: boolean = false;
  public get isTouching() {
    return this._isTouching;
  }
  public set isTouching(value: boolean) {
    this._isTouching = value;
  }

  @property({visible: true})
  private _isSwiping: boolean = false;
  public get isSwiping() {
    return this._isSwiping;
  }
  public set isSwiping(value: boolean) {
    this._isSwiping = value;
  }

  @property({type: Vec2, visible: true})
  private _swipeForce: Vec2 = v2(0,0);
  public get swipeForce() {
    return this._swipeForce;
  }
  public set swipeForce(value: Vec2) {
    this._swipeForce = value;
  }

  @property({visible: true})
  private _swipeDirection: string = "";
  public get swipeDirection() {
    return this._swipeDirection;
  }
  public set swipeDirection(value: string) {
    this._swipeDirection = value;
  }

  @property({visible: true})
  private _isReversing: boolean = false;
  public get isReversing() {
    return this._isReversing;
  }
  public set isReversing(value: boolean) {
    this._isReversing = value;
  }

  @property({type: Vec2, visible: true})
  private _touchMonitorMomentum: Vec2 = v2(0,0)
  public get touchMonitorMomentum() {
    return this._touchMonitorMomentum;
  }
  public set touchMonitorMomentum(value: Vec2) {
    this._touchMonitorMomentum = value;
  }

  @property({type: CCFloat, visible: true})
  private _swipeModifierOutput: number = 0;
  public get swipeModifierOutput() {
    return this._swipeModifierOutput;
  }
  public set swipeModifierOutput(value: number) {
    this._swipeModifierOutput = value;
  }

  @property({type: CCFloat, visible: true})
  private _momentumModifierOutput: number = 0;
  public get momentumModifierOutput() {
    return this._momentumModifierOutput;
  }
  public set momentumModifierOutput(value: number) {
    this._momentumModifierOutput = value;
  }
  
  
}