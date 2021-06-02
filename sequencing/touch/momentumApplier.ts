
import { _decorator, Component, CCInteger, Vec2 } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import { GetSquareMagnitude } from '../../utils';
import InputModule from '../inputModule';
import MasterSequence from '../masterSequence';
import { SequenceController } from '../sequenceController';
import TouchController from './touchController';
import TouchModule from './touchModule';
const { ccclass, property, executionOrder} = _decorator;

@ccclass('MomentumApplier')
@executionOrder(5)
export default class MomentumApplier extends Component implements TouchModule  {

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
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM], this.updateSequenceWithMomentum, this);
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.refreshLocalMomentum, this);
  }

  onDisable () {
    this.touchController.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM], this.updateSequenceWithMomentum, this);
    this.touchController.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.refreshLocalMomentum, this);
  }

  update()
  {
      if (this.appUtilsRequested == true || this.hasMomentum == false || this.moduleActive == false) return;
      
      let momentumModifier = 0;

      momentumModifier = this.getMomentumModifier(this.touchController, this.momentumForceToApply);

      // if (touchController.axisMonitor.axisTransitionActive == false &&
      //     touchController.joiner.forkTransitionActive == false) {
      //     momentumModifier = GetMomentumModifier(touchController, momentumForceToApply);

      // } else {
      //     // If we're in a transition, only apply force from the axis currently receiving greatest input
      //     momentumForceToApply = NormalizeMomentumForce(lastSwipeDirection, momentumForceToApply);
      //     Vector2 modifiedForce = GetDominantMomentumForce(lastSwipeDirection, momentumForceToApply);
      //     momentumModifier = GetMomentumModifier(touchController, modifiedForce);
      // }
      
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

      momentumModifier += this.getAxisMomentum(momentumForce,
      null, touchController.isReversing);

      // if (touchController.yMomentumAxis.IsActive() == true) {
      //     momentumModifier += GetAxisMomentum(momentumForce,
      //         touchController.yMomentumAxis.GetVariable() as Axis, touchController.isReversing);
      // }

      // if (touchController.xMomentumAxis.IsActive() == true) {
      //     momentumModifier += GetAxisMomentum(momentumForce,
      //         touchController.xMomentumAxis.GetVariable() as Axis, touchController.isReversing);
      // }

      return momentumModifier;
  }

  getAxisMomentum(momentumForce: Vec2, sourceAxis: any, isReversing: boolean)
  {
      let correctedMomentum = 0;
      let directionModifier = 0;

      directionModifier = isReversing == false ? 1 : -1;
      correctedMomentum = Math.abs(momentumForce.y) * directionModifier;

      // switch (sourceAxis.axisType) {
      
      //     case AxisType.Y:
      //         directionModifier = isReversing == false ? 1f : -1f;
      //         correctedMomentum = Mathf.Abs(momentumForce.y) * directionModifier;
      //         break;
          
      //     case AxisType.X:
      //         directionModifier = isReversing == false ? 1f : -1f;
      //         correctedMomentum = Mathf.Abs(momentumForce.x) * directionModifier;
      //         break;
          
      //     default:
      //         throw new ArgumentOutOfRangeException();
      // }

      return correctedMomentum;
  }

}