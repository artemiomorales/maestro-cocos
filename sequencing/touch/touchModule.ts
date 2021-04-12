
import { _decorator, Component, Node } from 'cc';
import InputModule from '../inputModule';
import TouchController from './touchController';
const { ccclass, property } = _decorator;

@ccclass('TouchModule')
export default class TouchModule extends InputModule {

  @property({type: TouchController, visible: true})
  private _touchController: TouchController = null!;
  public get touchController() {
    return this._touchController;
  }
  public set touchController(value: TouchController) {
    this._touchController = value;
  }

}
