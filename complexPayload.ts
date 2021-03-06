
import { Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;

interface ComplexPayloadInterface {
  [key: string] : any;
}

@ccclass('ComplexPayload')
export default class ComplexPayload {

  private _payload: ComplexPayloadInterface = {};
  public get payload() {
    return this._payload;
  }
  public set payload(value: ComplexPayloadInterface) {
    this._payload = value;
  }

  set(key: string, value: any) {
    this.payload[key] = value;
  }

  get(callingObject: Node, key: string) {
    if(this.payload.hasOwnProperty(key)) {
      return this.payload[key];
    }
    console.log("Key " + key + " not found in complex payload");
    return null;
  }
}