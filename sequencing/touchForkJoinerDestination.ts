
import { _decorator, Component, Node, TextAsset } from 'cc';
import { BranchingPath } from './branchingPath';
import { ForkJoinerDestination } from './forkJoinerDestination';
const { ccclass, property } = _decorator;

@ccclass('TouchForkJoinerDestination')
export class TouchForkJoinerDestination extends ForkJoinerDestination {

  public _originKey: TextAsset = null!;
  public get originKey() {
    return this._originKey;
  }
  public set originKey(value: TextAsset) {
    this._originKey = value;
  }

  constructor(active: boolean, originKey: TextAsset, branchingPaths: BranchingPath[]) {
    super(active, branchingPaths);
    this.originKey = originKey;
  }

}