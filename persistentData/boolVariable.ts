
import { _decorator, Component, Node, TextAsset } from 'cc';
import { PersistentVariable } from './persistentVariable';
const { ccclass, property } = _decorator;

@ccclass('BoolVariable')
export class BoolVariable extends PersistentVariable {
  
  @property({visible: true})
  private _value: boolean = false;
  private get value() {
    return this._value;
  }
  private set value(value: boolean) {
    this._value = value;
  }

  @property({visible: true})
  private _defaultValue: boolean = false;
  private get defaultValue() {
    return this._defaultValue;
  }
  private set defaultValue(value: boolean) {
    this._defaultValue = value;
  }

  getValue() {
    return this.value;
  }

  setValue(targetValue: boolean) {
    this.value = targetValue;
    return this;
  }

  setToDefaultValue(targetValue: boolean) {
    if(this.hasDefault) {
      this.value = this.defaultValue
    } else {
      console.log("Method SetDefaultValue() called on " + this.variableKey.name + ", but var does not have a default value assigned.")
    }
  }

}
