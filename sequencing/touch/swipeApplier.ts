
import { _decorator, Vec2 } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import InputModule from '../inputModule';
import TouchModule from './touchModule';
const { ccclass, property } = _decorator;

@ccclass('SwipeApplier')
export default class SwipeApplier extends TouchModule {

  start() {
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE], () => {
      this.updateSequenceWithSwipe();
    })
  }

  onDisable () {
    this.touchController.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE], this.updateSequenceWithSwipe, this);
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


  applySwipeModifier(source: InputModule, timeModifier: number) {
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
