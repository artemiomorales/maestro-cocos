
import { _decorator, Component, Node } from 'cc';
import { SimpleSignal } from './simpleSignal';
const { ccclass, property } = _decorator;

@ccclass('ModifiableEditorVariable')
export class ModifiableEditorVariable extends SimpleSignal {
    
  private _hasDefault = false;
  private get hasDefault() {
    return this._hasDefault;
  }
  private set hasDefault(value: boolean) {
    this._hasDefault = value;
  }


}