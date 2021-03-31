
import { _decorator, Component, Node, Script, Vec2, v2 } from 'cc';
import { ModifiableEditorVariable } from './modifiableEditorVariable';
const { ccclass, property } = _decorator;

@ccclass('V2Variable')
export class V2Variable extends ModifiableEditorVariable {
    
  @property({type: Vec2})
  private _value: Vec2 = v2(0,0);
  private get value() {
    return this._value;
  }
  private set value(value: Vec2) {
    this._value = value;
  }

  public SetValue(value: Vec2)
  {
      if (this.callerRegistered() == false) return;

      this.value = value;

      this.signalChange();
  }
  
}