import { Node } from "cc";
import { InputController } from "./inputController";

export default interface InputModule {
  moduleActive: boolean;
  priority: number;
  inputController: InputController;
  activate: Function;
  deactivate: Function;
  triggerInputActionComplete: Function;
  nodeElement: Node;
}