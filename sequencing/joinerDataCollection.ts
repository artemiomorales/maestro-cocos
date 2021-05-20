
import { _decorator, Component, Node } from 'cc';
import { JoinerData } from './joinerData';
import { SequenceController } from './sequenceController';
const { ccclass, property } = _decorator;

@ccclass('JoinerDataCollection')
export class JoinerDataCollection {

  @property({type: SequenceController, visible: true})
  private _sequence: SequenceController = null!;
  public get sequence() {
    return this._sequence;
  }
  public set sequence(value: SequenceController) {
    this._sequence = value;
  }

  @property({type: JoinerData, visible: true})
  private _joinerData: JoinerData = null!;
  public get joinerData() {
    return this._joinerData;
  }
  public set joinerData(value: JoinerData) {
    this._joinerData = value;
  }

}
