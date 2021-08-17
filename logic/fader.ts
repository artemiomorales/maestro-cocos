
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

  @property({type: TextAsset, visible: true})
  private _enableSpinnerKey: TextAsset = null!;

  public get enableSpinnerKey() {
    return this._enableSpinnerKey;
  }
  public set enableSpinnerKey(value: TextAsset) {
    this._enableSpinnerKey = value;
  }

  @property({type: TextAsset, visible: true})
  private _enableProgressBarKey: TextAsset = null!;

  public get enableProgressBarKey() {
    return this._enableProgressBarKey;
  }
  public set enableProgressBarKey(value: TextAsset) {
    this._enableProgressBarKey = value;
  }

  public get progressBarVisible() {
    return this.appSettings.getProgressBarVisible(this.node);
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

  private _complexPayloadCache: ComplexPayload = null!;
  public get complexPayloadCache() {
    return this._complexPayloadCache;
  }
  public set complexPayloadCache(value: ComplexPayload) {
    this._complexPayloadCache = value;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.appSettingsNode.on(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_FADE_TO_BLACK], this.fadeToBlack, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED], this.fadeIn, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.HIDE_PROGRESS_BAR_COMPLETED], this.hideProgressBarCompletedCallback, this);
  }

  onDestroy() {
    this.appSettingsNode.off(Object.keys(COMPLEX_EVENT)[COMPLEX_EVENT.TRIGGER_FADE_TO_BLACK], this.fadeToBlack);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.SCENE_LOAD_COMPLETED], this.fadeIn);
    this.appSettingsNode.off(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.HIDE_PROGRESS_BAR_COMPLETED], this.hideProgressBarCompletedCallback);
  }

  fadeToBlack(complexPayload: ComplexPayload) {
    const enableSpinner = complexPayload.get(this.node, this.enableSpinnerKey.name);
    const enableProgressBar = complexPayload.get(this.node, this.enableProgressBarKey.name);

    tween(this.overlay)
      .to(this.fadeToBlackTime, {opacity: 255}, {
        easing: 'quadInOut',
        'onComplete': () => {

          if(enableProgressBar === true) {
            this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TRIGGER_SHOW_PROGRESS_BAR]);
          }

          this.appSettings.triggerSimpleEvent(this.node, complexPayload.get(this.node, this.eventCallbackKey.name))
        }
      })
      .start();
  }

  executeFadeOut() {

  }

  fadeIn() {
    if(this.progressBarVisible === true) {
      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TRIGGER_HIDE_PROGRESS_BAR]);
    } else {
      this.executeFadeIn();
    }
  }

  hideProgressBarCompletedCallback() {
    this.executeFadeIn();
  }

  executeFadeIn() {
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