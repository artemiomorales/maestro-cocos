
import { _decorator, Component, CCInteger, Vec2, Node, find } from 'cc';
import { AXIS_TYPE, CONSTANTS, SIMPLE_EVENT, SWIPE_DIRECTION } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import { Axis } from '../../persistentData/axis';
import InputModule from '../inputModule';
import MasterSequence from '../masterSequence';
import { SequenceController } from '../sequenceController';
import TouchController from './touchController';
import TouchModule from './touchModule';
const { ccclass, property, executionOrder} = _decorator;

@ccclass('MomentumApplier')
@executionOrder(5)
export default class MomentumApplier extends Component implements TouchModule  {

  public appSettingsNode: Node = null!;
  public appSettings: AppSettings = null!;

  @property({visible: true})
  private _moduleActive: boolean = false;
  public get moduleActive() {
    return this._moduleActive;
  }
  public set moduleActive(value: boolean) {
    this._moduleActive = value;
  }

  public get nodeElement() {
    return this.node;
  }

  public get axisTransitionActive() {
    return this.appSettings.getAxisTransitionActive(this.node);
  }

  public get swipeDirection() {
    return this.appSettings.getSwipeDirection(this.node);
  }

  @property({type: TouchController, visible: true})
  private _touchController: TouchController = null!;
  public get touchController() {
    return this._touchController;
  }
  public set touchController(value: TouchController) {
    this._touchController = value;
  }

  @property({type: CCInteger, visible: true})
  private _priority: number = 0;
  public get priority() {
    return this._priority;
  }
  public set priority(value: number) {
    this._priority = value;
  }

  public get inputController() {
    return this.touchController;
  }

  public get appUtilsRequested() {
    return this.touchController.appSettings.getAppUtilsRequested(this.node);
  }

  public get touchMonitorMomentumCache() {
    return this.touchController.appSettings.getTouchMonitorMomentumCache(this.node);
  }

  public get momentumDecay() {
    return this.touchController.appSettings.getMomentumDecay(this.node);
  }

  private _momentumForceToApply: Vec2 = new Vec2();
  public get momentumForceToApply() {
    return this._momentumForceToApply;
  }
  public set momentumForceToApply(value: Vec2) {
    this._momentumForceToApply = value;
  }

  private _hasMomentum: boolean = false;
  public get hasMomentum() {
    return this._hasMomentum;
  }
  public set hasMomentum(value: boolean) {
    this._hasMomentum = value;
  }

  private _lastSwipeDirection: string = "";
  public get lastSwipeDirection() {
    return this._lastSwipeDirection;
  }
  public set lastSwipeDirection(value: string) {
    this._lastSwipeDirection = value;
  }

  activate() {
    this.moduleActive = true;
  }

  deactivate() {
    this.moduleActive = false;
  }

  triggerInputActionComplete() {
    for (let i = 0; i < this.inputController.masterSequences.length; i++) {
      this.inputController.masterSequences[i].unlockInputModule(this.node);
    }
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    // this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM], this.updateSequenceWithMomentum, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START], this.haltMomentum, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.refreshLocalMomentum, this);
  }

  onDisable () {
    // this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM], this.updateSequenceWithMomentum, this);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START], this.haltMomentum, this);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.refreshLocalMomentum, this);
  }

  update()
  {
      if (this.appUtilsRequested == true || this.hasMomentum == false || this.moduleActive == false) return;
      
      let momentumModifier = 0;

      if (this.axisTransitionActive == false) {
          momentumModifier = this.getMomentumModifier(this.touchController, this.momentumForceToApply);

          // if (this.touchController.axisMonitor.axisTransitionActive == false &&
          // this.touchController.joiner.forkTransitionActive == false) {
          // momentumModifier = GetMomentumModifier(this.touchController, momentumForceToApply);

      } else {
          // If we're in a transition, only apply force from the axis currently receiving greatest input
          this.momentumForceToApply = MomentumApplier.normalizeMomentumForce(this.lastSwipeDirection, this.momentumForceToApply);
          const modifiedForce = MomentumApplier.getDominantMomentumForce(this.lastSwipeDirection, this.momentumForceToApply);
          momentumModifier = this.getMomentumModifier(this.touchController, modifiedForce);
      }
      
      this.updateSequenceWithMomentum(this, momentumModifier);
      
      if (this.momentumForceToApply.dot(this.momentumForceToApply) < .00001) {
          this.momentumForceToApply = new Vec2(0, 0);
          this.hasMomentum = false;
      }
      
      this.momentumForceToApply = new Vec2(this.momentumForceToApply.x * this.momentumDecay, this.momentumForceToApply.y * this.momentumDecay);
  }

  refreshLocalMomentum() {
    this.hasMomentum = true;
    this.momentumForceToApply = this.touchMonitorMomentumCache;
    this.lastSwipeDirection = this.swipeDirection;  
  }

  haltMomentum()
  {
      this.momentumForceToApply = new Vec2(0, 0);
      this.hasMomentum = false;
  }

  updateSequenceWithMomentum(momentumApplier: MomentumApplier, momentumModifier: number) {
    const touchController = momentumApplier.touchController;
    touchController.momentumModifierOutput = momentumModifier;

    for(let i=0; i<this.touchController.rootConfig.masterSequences.length; i++) {
      let masterSequence = this.touchController.rootConfig.masterSequences[i];
      for(let q=0; q<masterSequence.sequenceControllers.length; q++) {
        if(masterSequence.sequenceControllers[q].active === true) {
          MomentumApplier.applyMomentumModifier(touchController.rootConfig.masterSequences, momentumApplier, masterSequence.sequenceControllers[q], touchController.momentumModifierOutput);
        }
      }
    }

            
    // for (let q=0; q < touchController.touchDataList.Count; q++)
    // {
    //     Touch_Data touchData = touchController.touchDataList[q];

    //     if (touchData.sequence.active == false || touchData.pauseMomentumActive == true)  {
    //         continue;
    //     }

    //     touchController.momentumModifierOutput = momentumModifier;
        
    //     if (touchData.forceForward == true) {
    //         touchController.momentumModifierOutput = Mathf.Abs(momentumModifier);
    //     } else if (touchData.forceBackward == true) {
    //         touchController.momentumModifierOutput = Mathf.Abs(momentumModifier) * -1f;
    //     }

    //     MomentumApplier.applyMomentumModifier(touchController.rootConfig.masterSequences, momentumApplier, touchData.sequence, touchController.momentumModifierOutput);
    // }
    
    // this.touchController.appSettings.triggerSimpleEvent(momentumApplier.gameObject);
    return touchController;
  }

  static applyMomentumModifier(masterSequences: MasterSequence[], source: InputModule, targetSequence: SequenceController, timeModifier: number)
  {
      const masterSequence = masterSequences.find(x => x.sequenceControllers.find(y => y == targetSequence)) as MasterSequence;
      masterSequence.requestModifySequenceTime(targetSequence, source.priority, source.nodeElement.name, timeModifier);

      return targetSequence;
  }

  getMomentumModifier(touchController: TouchController, momentumForce: Vec2)
  {
      let momentumModifier = 0;

      // Force the momentum values to correspond to our axis based on whether we are reversing
      // or not (which is determined by the swipe applier)

      if (this.touchController.yMomentumAxis.active == true) {
          momentumModifier += this.getAxisMomentum(momentumForce,
              this.touchController.yMomentumAxis, this.touchController.isReversing);
      }

      if (this.touchController.xMomentumAxis.active == true) {
          momentumModifier += this.getAxisMomentum(momentumForce,
              this.touchController.xMomentumAxis, this.touchController.isReversing);
      }

      return momentumModifier;
  }

  getAxisMomentum(momentumForce: Vec2, sourceAxis: Axis, isReversing: boolean)
  {
      let correctedMomentum = 0;
      let directionModifier = 0;

      switch (sourceAxis.axisType) {
      
          case AXIS_TYPE.Y:
              directionModifier = isReversing == false ? 1 : -1;
              correctedMomentum = Math.abs(momentumForce.y) * directionModifier;
              break;
          
          case AXIS_TYPE.X:
              directionModifier = isReversing == false ? 1 : -1;
              correctedMomentum = Math.abs(momentumForce.x) * directionModifier;
              break;
          
          default:
              throw "Invalid axis type specified"
      }

      return correctedMomentum;
  }

  static normalizeMomentumForce(swipeDirection: string, momentumForce: Vec2) : Vec2
  {
      // Replace momentum on the new axis with momentum from the old axis.
      // In most cases, we'll need to do this transformation by undoing the sensitivity operation
      if (swipeDirection == SWIPE_DIRECTION.xPositive || SWIPE_DIRECTION.xNegative) {
          return new Vec2(momentumForce.x, momentumForce.x);
      } 
      
      return new Vec2( momentumForce.y, momentumForce.y);
  }

  static getDominantMomentumForce(swipeDirection: string, momentumForce: Vec2) : Vec2
  {
      if (SWIPE_DIRECTION.xPositive || SWIPE_DIRECTION.xNegative) {
          return new Vec2(momentumForce.x, 0);
      } 
      
      return new Vec2( 0, momentumForce.y);
  }

}