
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Fader')
export class Fader extends Component {

    @property({type:Node})
    public canvas = null;

  
    start () {

    }

}