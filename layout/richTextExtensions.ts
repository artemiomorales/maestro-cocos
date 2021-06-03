
import { _decorator, Component, Node, TextAsset, RichTextComponent, Color } from 'cc';
import { GetSceneData } from '../utils';
const { ccclass, property } = _decorator;

@ccclass('RichTextExtensions')
export class RichTextExtensions extends Component {

  @property({type: TextAsset, visible: true})
  private _variableReference: TextAsset = null!;
  public get variableReference() {
    return this._variableReference;
  }
  public set variableReference(value: TextAsset) {
    this._variableReference = value;
  }

  @property({visible: true})
  private _targetColor: Color = new Color();
  public get targetColor() {
    return this._targetColor;
  }
  public set targetColor(value: Color) {
    this._targetColor = value;
  }


  private _richTextComponent: RichTextComponent = null!;
  public get richTextComponent() {
    return this._richTextComponent;
  }
  public set richTextComponent(value: RichTextComponent) {
    this._richTextComponent = value;
  }

  start() {
    this.richTextComponent = this.getComponent(RichTextComponent) as RichTextComponent;
  }

  setTextToReference () {
    if(this.variableReference) {
      const sceneData = GetSceneData();
      const value = sceneData.getValue(this.node, this.variableReference);
      this.richTextComponent.string = `<color=#${this.targetColor}>${value.toString()}</color>`
    }
  }

}