
import { _decorator, Component, Node } from 'cc';
import InputData from '../inputData';
import SequenceController from '../sequenceController';
const { ccclass, property } = _decorator;

@ccclass('GenericInputData')
export class GenericInputData implements InputData {

  @property({type: SequenceController, visible: true})
  private _sequenceController: SequenceController = null!;
  public get sequenceController() {
    return this._sequenceController;
  }
  public set sequenceController(value: SequenceController) {
    this._sequenceController = value;
  }

}
