
import { _decorator, Vec2, Component, CCInteger, Node, find } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from '../../constants';
import AppSettings from '../../persistentData/appSettings';
import SequenceController from '../sequenceController';
import TouchController from './touchController';
import TouchModule from './touchModule';
const { ccclass, property, executionOrder} = _decorator;

@ccclass('SwipeApplier')
@executionOrder(5)
export default class SwipeApplier extends Component implements TouchModule {

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

  public get forkTransitionActive() {
    return this.appSettings.getForkTransitionActive(this.node);
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
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE], this.updateSequenceWithSwipe, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.triggerInputActionComplete, this);
  }

  onDestroy () {
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE], this.updateSequenceWithSwipe, this);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END], this.triggerInputActionComplete, this);
  }

  updateSequenceWithSwipe () {
    let swipeForceToApply: Vec2 = this.touchController.swipeForce;

    // If we're in a fork, only apply force from the axis currently receiving greatest input
    if (this.axisTransitionActive === true || this.forkTransitionActive === true) {
      swipeForceToApply = this.touchController.getDominantTouchForce(swipeForceToApply);
    }

    this.touchController.swipeModifierOutput = 0;

    if (this.touchController.ySwipeAxis.active == true) 
    {
      if (this.touchController.ySwipeAxis.inverted == false) {
          this.touchController.swipeModifierOutput += swipeForceToApply.y;
      } else {
          this.touchController.swipeModifierOutput += swipeForceToApply.y * -1;
      }
    }
    
    if (this.touchController.xSwipeAxis.active == true)
    {
      if (this.touchController.xSwipeAxis.inverted == false) {
          this.touchController.swipeModifierOutput += swipeForceToApply.x;
      } else {
          this.touchController.swipeModifierOutput += swipeForceToApply.x * -1;
      }
    }

    if(this.touchController.swipeModifierOutput > 0) {
      this.touchController.isReversing = false;
    } else if(this.touchController.swipeModifierOutput < 0) {
      this.touchController.isReversing = true;
    }
    

    for(let i=0; i<this.touchController.touchDataList.length; i++) {
      const touchData = this.touchController.touchDataList[i];
      if(touchData.sequenceController.active === false) {
        continue;
      }
      if(touchData.forceForward === true) {
        this.touchController.swipeModifierOutput = Math.abs(this.touchController.swipeModifierOutput);
      } else if (touchData.forceBackward == true) {
        this.touchController.swipeModifierOutput = Math.abs(this.touchController.swipeModifierOutput) * -1;
      }
      this.applySwipeModifier(this, touchData.sequenceController, this.touchController.swipeModifierOutput);
    }
  }

  applySwipeModifier(source: SwipeApplier, targetSequence: SequenceController, timeModifier: number) {
    for(let i=0; i<this.touchController.rootConfig.masterSequences.length; i++) {
      let masterSequence = this.touchController.rootConfig.masterSequences[i];
      for(let q=0; q<masterSequence.sequenceControllers.length; q++) {
        if(masterSequence.sequenceControllers[q] === targetSequence) {
          masterSequence.requestModifySequenceTime(masterSequence.sequenceControllers[q], source.priority, source.node.name, timeModifier);
        }
      }
    }
  }

}
