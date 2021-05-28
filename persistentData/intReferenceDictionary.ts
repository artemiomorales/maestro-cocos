
import { _decorator, Component, Node } from 'cc';
import { IntReference } from './intReference';
import { VariableReferenceDictionary } from './variableReferenceDictionary';
const { ccclass, property } = _decorator;

@ccclass('IntReferenceDictionary')
export class IntReferenceDictionary extends VariableReferenceDictionary {

  @property({type: IntReference, visible: true})
  private _intReference: IntReference = null!;

  public get intReference() {
    return this._intReference;
  }
  public set intReference(value: IntReference) {
    this._intReference = value;
  }

}