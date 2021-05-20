
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JoinerDestination')
export class JoinerDestination {

  @property({type:Node, visible: true})
  private _destination: Node = null!;
  public get destination() {
    return this._destination;
  }
  public set destination(value: Node) {
    this._destination = value;

  }

}
