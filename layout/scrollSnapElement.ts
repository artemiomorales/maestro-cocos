
import { _decorator, Component, Node, EventHandler, SpriteFrame, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScrollSnapElement')
export class ScrollSnapElement {

  @property({type: Node, visible: true})
  private _sourceTransform: Node = null!;
  public get sourceTransform() {
    return this._sourceTransform;
  }
  public set sourceTransform(value: Node) {
    this._sourceTransform = value;
  }

  @property({type: Sprite, visible: true})
  private _elementIcon: Sprite = null!;
  public get elementIcon() {
    return this._elementIcon;
  }
  public set elementIcon(value: Sprite) {
    this._elementIcon = value;
  }

  @property({type: [EventHandler], visible: true})
  private _activateEvent: EventHandler[] = [];
  public get activateEvent() {
    return this._activateEvent;
  }
  public set activateEvent(value: EventHandler[]) {
    this._activateEvent = value;
  }

  @property({type: [EventHandler], visible: true})
  private _deactivateEvent: EventHandler[] = [];
  public get deactivateEvent() {
    return this._deactivateEvent;
  }
  public set deactivateEvent(value: EventHandler[]) {
    this._deactivateEvent = value;
  }

  @property({visible: true})
  private _active: Boolean = false;
  public get active() {
    return this._active;
  }
  public set active(value: Boolean) {
    this._active = value;
  }

  @property({visible: true})
  private _iconEnabledColor: Color = new Color(0, 0, 0, 255);
  public get iconEnabledColor() {
    return this._iconEnabledColor;
  }
  public set iconEnabledColor(value: Color) {
    this._iconEnabledColor = value;
  }

  @property({visible: true})
  private _iconDisabledColor: Color = new Color(255, 255, 255, 255);
  public get iconDisabledColor() {
    return this._iconDisabledColor;
  }
  public set iconDisabledColor(value: Color) {
    this._iconDisabledColor = value;
  }

  activate()
  {
    if (this.active == false) {
      this.active = true;
      if (this.elementIcon != null) {
          this.elementIcon.color = this.iconEnabledColor;
      }
      EventHandler.emitEvents(this.activateEvent);
    }
  }

  deactivate()
  {
    if (this.active == true) {
      this.active = false;
      if (this.elementIcon != null) {
          this.elementIcon.color = this.iconDisabledColor;
      }
      EventHandler.emitEvents(this.deactivateEvent);
    }
  }

}
