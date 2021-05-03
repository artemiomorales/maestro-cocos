
import { _decorator, Component, CCInteger } from 'cc';
import { SIMPLE_EVENT } from '../../constants';
import TouchController from './touchController';
import TouchModule from './touchModule';
const { ccclass, property, executionOrder} = _decorator;

@ccclass('MomentumApplier')
@executionOrder(5)
export default class MomentumApplier extends Component implements TouchModule  {

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

  start () {
    this.touchController.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM], () => {
      this.updateSequenceWithMomentum();
    })
  }

  updateSequenceWithMomentum() {

  }

}