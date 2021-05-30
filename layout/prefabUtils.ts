
import { _decorator, Component, Node, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PrefabUtils')
export class PrefabUtils extends Component {

  @property({type: Prefab, visible: true})
  private _prefab: Prefab = null!;
  public get prefab() {
    return this._prefab;
  }
  public set prefab(value: Prefab) {
    this._prefab = value;
  }

  instantiatePrefab() {
    const scene = director.getScene();
    const instance = instantiate(this.prefab);
    
    instance.parent = scene as any;
  }

}

