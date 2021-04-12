
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UserPreferences')
export default class UserPreferences {

  @property({visible: true})
  private _ySensitivity = .0027;
  public get ySensitivity() {
    return this._ySensitivity;
  }
  public set ySensitivity(value: number) {
    this._ySensitivity = value;
  }

  @property({visible: true})
  private _invertYInput = false;
  public get invertYInput() {
    return this._invertYInput;
  }
  public set invertYInput(value: boolean) {
    this._invertYInput = value;
  }

  @property({visible: true})
  private _xSensitivity = .0054;
  public get xSensitivity() {
    return this._xSensitivity;
  }
  public set xSensitivity(value: number) {
    this._xSensitivity = value;
  }

  @property({visible: true})
  private _invertXInput = false;
  public get invertXInput() {
    return this._invertXInput;
  }
  public set invertXInput(value: boolean) {
    this._invertXInput = value;
  }

  start () {

  }

}
