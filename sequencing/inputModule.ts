import { Node } from "cc";
import { InputController } from "./inputController";

export default interface InputModule {
  moduleActive: boolean;
  priority: number;
  inputController: InputController;
  Activate: Function;
  Deactivate: Function;
  TriggerInputActionComplete: Function;
  nodeElement: Node;
}