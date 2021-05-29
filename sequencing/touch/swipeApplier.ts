
import { _decorator, Vec2, Component, CCInteger } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import TouchController from './touchController';
import TouchModule from './touchModule';
const { ccclass, property, executionOrder} = _decorator;

@ccclass('SwipeApplier')
@executionOrder(5)
export default class SwipeApplier extends Component implements TouchModule {

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

  start() {
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE], this.updateSequenceWithSwipe, this);
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.triggerInputActionComplete, this);
  }

  onDisable () {
    this.touchController.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE], this.updateSequenceWithSwipe, this);
    this.touchController.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.triggerInputActionComplete);
  }

  updateSequenceWithSwipe () {
    let swipeForceToApply: Vec2 = this.touchController.swipeForce;

    this.touchController.swipeModifierOutput = 0;
    this.touchController.swipeModifierOutput += swipeForceToApply.y;

    if(this.touchController.swipeModifierOutput > 0) {
      this.touchController.isReversing = false;
    } else if(this.touchController.swipeModifierOutput < 0) {
      this.touchController.isReversing = true;
    }
    
    this.applySwipeModifier(this, this.touchController.swipeModifierOutput);
  }


  applySwipeModifier(source: SwipeApplier, timeModifier: number) {
    for(let i=0; i<this.touchController.rootConfig.masterSequences.length; i++) {
      let masterSequence = this.touchController.rootConfig.masterSequences[i];
      for(let q=0; q<masterSequence.sequenceControllers.length; q++) {
        if(masterSequence.sequenceControllers[q].active === true) {
          masterSequence.requestModifySequenceTime(masterSequence.sequenceControllers[q], source.priority, source.node.name, timeModifier);
        }
      }
    }
  }

}
