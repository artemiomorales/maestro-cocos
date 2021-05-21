
import { _decorator, Component, Node, CCFloat, tween, Vec2, Vec3 } from 'cc';
import { ScrollSnapElement } from './scrollSnapElement';
const { ccclass, property } = _decorator;

@ccclass('ScrollSnapController')
export class ScrollSnapController extends Component {

  @property({visible: true})
  private _readyForUpdate: Boolean = false;
  public get readyForUpdate() {
    return this._readyForUpdate;
  }
  public set readyForUpdate(value: Boolean) {
    this._readyForUpdate = value;
  }

  @property({type: CCFloat, visible: true})
  private _baseWidth: number = 1080;
  public get baseWidth() {
    return this._baseWidth;
  }
  public set baseWidth(value: number) {
    this._baseWidth = value;
  }

  @property({type: CCFloat, visible: true})
  private _activeElementId: number = 0;
  public get activeElementId() {
    return this._activeElementId;
  }
  public set activeElementId(value: number) {
    this._activeElementId = value;
  }

  @property({type: Node, visible: true})
  private _content: Node = null!;
  public get content() {
    return this._content;
  }
  public set content(value: Node) {
    this._content = value;
  }

  @property({type: [ScrollSnapElement], visible: true})
  private _scrollSnapElements: ScrollSnapElement[] = [];
  public get scrollSnapElements() {
    return this._scrollSnapElements;
  }
  public set scrollSnapElements(value: ScrollSnapElement[]) {
    this._scrollSnapElements = value;
  }

  start () {
    this.readyForUpdate = true;
  }

  activate()
  {
    if (this.readyForUpdate == false) {
      this.logMessage();
      return;
    }
    this.lerpToElement(this.activeElementId);
  }
  
  deactivate()
  {
    this.readyForUpdate = false;
  }

  callLerpToNextElement()
  {
    if (this.readyForUpdate == false) {
      this.logMessage();
      return;
    }

    this.activeElementId += 1;
    if (this.activeElementId >= this.scrollSnapElements.length) {
      this.activeElementId = this.scrollSnapElements.length - 1;
    }

    this.lerpToElement(this.activeElementId);
  }

  callLerpToPreviousElement()
  {
    if (this.readyForUpdate == false) {
      this.logMessage();
      return;
    }

    this.activeElementId -= 1;
    if (this.activeElementId < 0) {
        this.activeElementId = 0;
    }
    this.lerpToElement(this.activeElementId);
  }

  lerpToElement(elementId: number)
  {
    const targetPosition = new Vec3(this.baseWidth * elementId * -1, 0, 0);

    tween(this.content)
      .to(.25, {position: targetPosition}, {
        easing: 'quadInOut',
        'onComplete': () => {
          this.lerpToElementCallback();
        }
      })
    .start();
  }


  lerpToElementCallback()
  {
    for (let i = 0; i < this.scrollSnapElements.length; i++) {
      if (i != this.activeElementId) {
          this.scrollSnapElements[i].deactivate();
      }
    }
    this.scrollSnapElements[this.activeElementId].activate();
  }

  logMessage()
  {
    console.log("Scroll snap controller must be activated before utilization", this);
  }

}