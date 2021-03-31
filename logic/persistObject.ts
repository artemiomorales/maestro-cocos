
import { _decorator, Component, Node, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PersistObject')
export class PersistObject extends Component {

    start () {
        game.addPersistRootNode(this.node);
    }

}
