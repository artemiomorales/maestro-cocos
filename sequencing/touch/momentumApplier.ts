
import { _decorator, Component, Node } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import TouchModule from './touchModule';
const { ccclass, property } = _decorator;

@ccclass('MomentumApplier')
export default class MomentumApplier extends TouchModule {

  start () {
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM], () => {
      this.updateSequenceWithMomentum();
    })
  }

  updateSequenceWithMomentum() {

  }

}