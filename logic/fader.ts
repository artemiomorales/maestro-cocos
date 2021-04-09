
import { _decorator, Component, Node, find, CCFloat, SpriteComponent, tween, Color, TextAsset, UIOpacity } from 'cc';
import ComplexPayload from '../complexPayload';
import { COMPLEX_EVENT, CONSTANTS, SIMPLE_EVENT } from '../constants';
import AppSettings from '../persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('Fader')
export class Fader extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({type: TextAsset, visible: true})
  private _eventCallbackKey: TextAsset = null!;

  public get eventCallbackKey() {
    return this._eventCallbackKey;
  }
  public set eventCallbackKey(value: TextAsset) {
    this._eventCallbackKey = value;
  }

  @property({type: UIOpacity, visible: true})
  public _overlay: UIOpacity = null!;

  public get overlay() {
    return this._overlay;
  }

  @property({type: CCFloat, visible: true, readonly: true})
  private _fadeToBlackTime: number = 4;

  public get fadeToBlackTime() {
    return this._fadeToBlackTime;
  }
  
  @property({type: CCFloat, visible: true, readonly: true})
  private _fadeInTime: number = 6;

  public get fadeInTime() {
    return this._fadeInTime;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_FADE_TO_BLACK], (complexPayload: ComplexPayload) => {
      this.fadeToBlack(complexPayload);
    })
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED], () => {
      this.fadeIn();
    })
  }

  fadeToBlack(complexPayload: ComplexPayload) {
    console.log(complexPayload);
    tween(this.overlay)
      .to(this.fadeToBlackTime, {opacity: 255}, {
        easing: 'quadInOut',
        'onComplete': () => {
          this.appSettings.triggerSimpleEvent(this.node, complexPayload.get(this.eventCallbackKey.name))
        }
      })
      .start();
  }

  fadeIn() {
    tween(this.overlay)
      .to(this.fadeInTime, {opacity: 0}, {
        easing: 'quadInOut',
        'onComplete': () => {
          this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.FADE_IN_COMPLETED])
        }
      })
      .start();
  }

}