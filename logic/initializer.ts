
import { _decorator, Component, Node, director, CCString } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('Initializer')
export class Initializer extends Component {

    @property({visible: true})
    private _bootstrapScene = "";

    public get bootstrapScene() {
      return this._bootstrapScene;
    }

    start () {
      director.loadScene(this.bootstrapScene);
    }

}
