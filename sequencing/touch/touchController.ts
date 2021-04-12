
import { _decorator } from 'cc';
import { InputController } from '../inputController';
import MomentumApplier from './momentumApplier';
import SwipeApplier from './swipeApplier';
const { ccclass, property } = _decorator;

@ccclass('TouchController')
export default class TouchController extends InputController {

  public get swipeForce() {
    return this.appSettings.getSwipeForce(this.node);
  }

  public get swipeDirection() {
    return this.appSettings.getSwipeDirection(this.node);
  }

  @property({type: SwipeApplier, visible: true})
  private _swipeApplier: SwipeApplier = null!;
  public get swipeApplier() {
    return this._swipeApplier;
  }
  public set swipeApplier(value: SwipeApplier) {
    this._swipeApplier = value;
  }

  @property({type: MomentumApplier, visible: true})
  private _momentumApplier: MomentumApplier = null!;
  public get momentumApplier() {
    return this._momentumApplier;
  }
  public set momentumApplier(value: MomentumApplier) {
    this._momentumApplier = value;
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

  

}