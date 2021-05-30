
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeExtensions')
export class NodeExtensions extends Component {

  activate() {
    this.node.active = true;
  }

  deactivate() {
    this.node.active = false;
  }

  destroyNode() {
    this.node.destroy();
  }

}