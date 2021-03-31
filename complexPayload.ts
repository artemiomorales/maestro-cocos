
import { _decorator, CCString } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComplexPayload')
export default class ComplexPayload {
    @property({type: [CCString], visible: true})
    private _keys: string[] = [];

    public get keys() {
      return this._keys;
    }
    public set keys(value) {
      this._keys = value;
    }

    @property({type: [CCString], visible: true})
    private _values: string[] = [];

    public get values() {
      return this._values;
    }
    public set values(value) {
      this._values = value;
    }
}

@ccclass('StringDictionary')
class StringDictionary {
  
}