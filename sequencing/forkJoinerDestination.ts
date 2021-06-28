
import { _decorator, Component, Node, TextAsset } from 'cc';
import { BranchingPath } from './branchingPath';
import { IJoinerDestination } from './iJoinerDestination';
const { ccclass, property } = _decorator;

@ccclass('ForkJoinerDestination')
export class ForkJoinerDestination implements IJoinerDestination {

  private _active: boolean = true;
  public get active() {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  public _destinationBranch: BranchingPath = new BranchingPath(null, null, null);
  public get destinationBranch() {
    return this._destinationBranch;
  }
  public set destinationBranch(value: BranchingPath) {
    this._destinationBranch = value;
  }

  public _branchingPaths: BranchingPath[] = [];
  public get branchingPaths() {
    return this._branchingPaths;
  }
  public set branchingPaths(value: BranchingPath[]) {
    this._branchingPaths = value;
  }

  constructor(active: boolean, branchingPaths: BranchingPath[]) {
    this.active = active;
    this.branchingPaths = branchingPaths;
  }

  setDestinationViaTextAsset(callingObject: Node, branchKey: TextAsset) {
    for(let i=0; i<this.branchingPaths.length; i++) {
      if(this.branchingPaths[i].branchKey == branchKey) {
        this.destinationBranch = this.branchingPaths[i];
        return;
      }
    }
    console.log("Branch key not found in destination branches!");
  }

  setDestinationViaString(callingObject: Node, branchKey: string) {
    for(let i=0; i<this.branchingPaths.length; i++) {
      if(this.branchingPaths[i].branchKey.name == branchKey) {
        this.destinationBranch = this.branchingPaths[i];
        return;
      }
    }
    console.log("Branch key not found in destination branches!");
  }

  setDestinationToEmpty(callingObject: Node) {
    this.destinationBranch = null!;
  }

}
