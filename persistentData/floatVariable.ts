
import { CCFloat, CCInteger, _decorator } from 'cc';
import { PersistentVariable } from './persistentVariable';
const { ccclass, property } = _decorator;

@ccclass('FloatVariable')
export class FloatVariable extends PersistentVariable {
  
  @property({type: CCFloat, visible: true})
  private _value: number = 0;
  private get value() {
    return this._value;
  }
  private set value(value: number) {
    this._value = value;
  }

  @property({type: CCFloat, visible: true})
  private _defaultValue: number = 0;
  private get defaultValue() {
    return this._defaultValue;
  }
  private set defaultValue(value: number) {
    this._defaultValue = value;
  }

  getValue() {
    return this.value;
  }

  setValue(targetValue: number) {
    this.value = targetValue;
    return this;
  }

  setToDefaultValue() {
    if(this.hasDefault) {
      this.value = this.defaultValue
    } else {
      console.log("Method SetDefaultValue() called on " + this.variableKey.name + ", but var does not have a default value assigned.")
    }
  }

}
