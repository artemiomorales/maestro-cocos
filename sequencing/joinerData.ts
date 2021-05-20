
import { _decorator, Component, Node } from 'cc';
import { SequenceController } from './sequenceController';
const { ccclass, property } = _decorator;

@ccclass('JoinerData')
export class JoinerData {

  @property({type: [SequenceController], visible: true})
  private _previousDestination: SequenceController[] = [];
  public get previousDestination() {
    return this._previousDestination;
  }
  public set previousDestination(value: SequenceController[]) {
    this._previousDestination = value;
  }

  @property({type: [SequenceController], visible: true})
  private _nextDestination: SequenceController[] = [];
  public get nextDestination() {
    return this._nextDestination;
  }
  public set nextDestination(value: SequenceController[]) {
    this._nextDestination = value;
  }

  @property({visible: true})
  private _isFork: boolean = false;
  public get isFork() {
    return this._isFork;
  }
  public set isFork(value: boolean) {
    this._isFork = value;
  }

}