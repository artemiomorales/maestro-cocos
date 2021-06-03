
import { _decorator, Component, Node, v2, Vec2, Vec3, CCFloat } from 'cc';
import { Axis } from './axis';
import { BoolVariable } from './boolVariable';
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
  private _isReversing: BoolVariable = new BoolVariable();
  public get isReversing() {
    return this._isReversing;
  }
  public set isReversing(value: BoolVariable) {
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

  @property({type: Vec2, visible: true})
  private _touchMonitorMomentumCache: Vec2 = v2(0,0);
  public get touchMonitorMomentumCache() {
    return this._touchMonitorMomentumCache;
  }
  public set touchMonitorMomentumCache(value: Vec2) {
    this._touchMonitorMomentumCache = value;
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

  @property({visible: true})
  private _axisTransitionActive: boolean = false;
  public get axisTransitionActive() {
    return this._axisTransitionActive;
  }
  public set axisTransitionActive(value: boolean) {
    this._axisTransitionActive = value;
  }

  @property({type: CCFloat, visible: true})
  private _axisTransitionSpread: number = 0;
  public get axisTransitionSpread() {
    return this._axisTransitionSpread;
  }
  public set axisTransitionSpread(value: number) {
    this._axisTransitionSpread = value;
  }

  @property({type: Axis, visible: true})
  private _ySwipeAxis: Axis = new Axis();
  public get ySwipeAxis() {
    return this._ySwipeAxis;
  }
  public set ySwipeAxis(value: Axis) {
    this._ySwipeAxis = value;
  }

  @property({type: Axis, visible: true})
  private _xSwipeAxis: Axis = new Axis();
  public get xSwipeAxis() {
    return this._xSwipeAxis;
  }
  public set xSwipeAxis(value: Axis) {
    this._xSwipeAxis = value;
  }

  @property({type: Axis, visible: true})
  private _yMomentumAxis: Axis = new Axis();
  public get yMomentumAxis() {
    return this._yMomentumAxis;
  }
  public set yMomentumAxis(value: Axis) {
    this._yMomentumAxis = value;
  }

  @property({type: Axis, visible: true})
  private _xMomentumAxis: Axis = new Axis();
  public get xMomentumAxis() {
    return this._xMomentumAxis;
  }
  public set xMomentumAxis(value: Axis) {
    this._xMomentumAxis = value;
  }

  @property({type: CCFloat, visible: true})
  private _frameStepValue: number = 0.02;
  public get frameStepValue() {
    return this._frameStepValue;
  }
  public set frameStepValue(value: number) {
    this._frameStepValue = value;
  }

  @property({type: CCFloat, visible: true})
  private _autorunThreshold: number = 0.03;
  public get autorunThreshold() {
    return this._autorunThreshold;
  }
  public set autorunThreshold(value: number) {
    this._autorunThreshold = value;
  }

  @property({visible: true})
  private _momentumDecay = .95;
  public get momentumDecay() {
    return this._momentumDecay;
  }
  public set momentumDecay(value: number) {
    this._momentumDecay = value;
  }

  private _variableMap: any = {};
  public get variableMap() {
    return this._variableMap;
  }
  public set variableMap(value: any) {
    this._variableMap = value;
  }
  
  initialize() {
    this.variableMap[this.isReversing.variableKey.name] = this.isReversing;
  }
}