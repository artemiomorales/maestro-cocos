
import { _decorator, Component, Node, TextAsset } from 'cc';
import { DESTINATION_ACTIVATION_TYPE } from '../constants';
import SequenceController from './sequenceController';
const { ccclass, property } = _decorator;

@ccclass('BranchingPath')
export class BranchingPath {
  
  public _branchKey: TextAsset = null!;
  public get branchKey() {
    return this._branchKey;
  }
  public set branchKey(value: TextAsset) {
    this._branchKey = value;
  }

  public _sequence: SequenceController = null!;
  public get sequence() {
    return this._sequence;
  }
  public set sequence(value: SequenceController) {
    this._sequence = value;
  }

  public _activationType: string = null!;
  public get activationType() {
    return this._activationType;
  }
  public set activationType(value: string) {
    this._activationType = value;
  }

  constructor(branchKey: TextAsset | null, sequence: SequenceController | null, activationType: string | null) {
    if(branchKey) {
      this.branchKey = branchKey;
    }
    if(sequence) {
      this.sequence = sequence;
    }
    if(activationType) {
      this.activationType = activationType;
    }
  }
}
