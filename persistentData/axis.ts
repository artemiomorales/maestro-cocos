
import { _decorator, Component, Node, TextAsset } from 'cc';
import { AXIS_TYPE } from '../constants';
import { PersistentVariable } from './persistentVariable';
const { ccclass, property } = _decorator;

@ccclass('Axis')
export class Axis {

  @property({type: TextAsset, visible: true})
  private _variableKey: TextAsset = null!;
  public get variableKey() {
    return this._variableKey;
  }
  public set variableKey(value: TextAsset) {
    this._variableKey = value;
  }

  @property({type: AXIS_TYPE, visible: true})
  private _axisType: number = null!;
  public get axisType() {
    return this._axisType;
  }
  public set axisType(value: number) {
    this._axisType = value;
  }

  @property({visible: true})
  private _active: boolean = false;
  public get active() {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  @property({visible: true})
  private _inverted: boolean = false;
  public get inverted() {
    return this._inverted;
  }
  public set inverted(value: boolean) {
    this._inverted = value;
  }

  // // This should ONLY be called when being created as part of an input group
  // public setAxisType(InputData inputData, AxisType targetAxisType)
  // {
  //     Debug.Log("Setting axis type via call from " + inputData.name);
      
  //     axisType = targetAxisType;

  //     return this;
  // }

  setStatus(callingObject: Node, targetValue: boolean)
  {
    // if (CallerRegistered() == false) return;

    this.active = targetValue;
  }

  setInverted(callingObject: Node, targetValue: boolean)
  {
      // if (CallerRegistered() == false) return;

      this.inverted = targetValue;
  }


}