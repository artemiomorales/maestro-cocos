
import { _decorator, Component, Node } from 'cc';
import InputData from '../inputData';
import { SequenceController } from '../sequenceController';
const { ccclass, property } = _decorator;

@ccclass('TouchData')
export class TouchData implements InputData {

  @property({type: SequenceController, visible: true})
  private _sequenceController: SequenceController = null!;
  public get sequenceController() {
    return this._sequenceController;
  }
  public set sequenceController(value: SequenceController) {
    this._sequenceController = value;
  }

  @property({visible: true})
  private _forceForward: boolean = false;
  public get forceForward() {
    return this._forceForward;
  }
  public set forceForward(value: boolean) {
    this._forceForward = value;
  }

  @property({visible: true})
  private _forceBackward: boolean = false;
  public get forceBackward() {
    return this._forceBackward;
  }
  public set forceBackward(value: boolean) {
    this._forceBackward = value;
  }

  static createInstance(sequence: SequenceController)
  {
      const inputData = new TouchData ();
      inputData.sequenceController = sequence;
      return inputData;
  }

}
