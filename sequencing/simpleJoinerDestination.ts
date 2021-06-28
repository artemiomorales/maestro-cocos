
import { _decorator, Component, Node } from 'cc';
import { IJoinerDestination } from './iJoinerDestination';
import SequenceController from './sequenceController';
const { ccclass, property } = _decorator;

@ccclass('SimpleJoinerDestination')
export class SimpleJoinerDestination implements IJoinerDestination {
  
  private _active: boolean = true;
  public get active() {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  private _sequence: SequenceController = null!;
  public get sequence() {
    return this._sequence;
  }
  public set sequence(value: SequenceController) {
    this._sequence = value;
  }

  constructor(active: boolean, sequence: SequenceController) {
    this.active = active;
    this.sequence = sequence;
  }

}

