
import { _decorator, Component, Node, Slider, CCFloat, find, UIOpacity, tween, ProgressBar as CCProgressBar } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from '../constants';
import AppSettings from '../persistentData/appSettings';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  public get progressBarVisible() {
    return this.appSettings.getProgressBarVisible(this.node);
  }

  public set progressBarVisible(value: boolean) {
    this.appSettings.setProgressBarVisible(this.node, value);
  }

  public get sceneLoadingProgress() {
    return this.appSettings.getSceneLoadingProgress(this.node);
  }

  @property({type: CCProgressBar, visible: true})
  private _slider: CCProgressBar = null!;

  public get slider() {
    return this._slider;
  }
  public set slider(value: CCProgressBar) {
    this._slider = value;
  }

  private _sliderOpacity: UIOpacity = null!;

  public get sliderOpacity() {
    return this._sliderOpacity;
  }
  public set sliderOpacity(value: UIOpacity) {
    this._sliderOpacity = value;
  }

  @property({type: CCFloat, visible: true, readonly: true})
  private _fadeTime: number = 0.6;

  public get fadeTime() {
    return this._fadeTime;
  }

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    this.sliderOpacity = this.slider.getComponent(UIOpacity) as UIOpacity;

    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TRIGGER_SHOW_PROGRESS_BAR], this.showProgressBar, this);
    this.appSettingsNode.on(Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.TRIGGER_HIDE_PROGRESS_BAR], this.hideProgressBar, this);
    this.appSettingsNode.on(this.appSettings.getSceneLoadingProgressVariableKey(this.node), this.updateProgress, this);
  }

  showProgressBar() {
    console.log("progress bar showing");
    this.progressBarVisible = true;
    tween(this.sliderOpacity)
      .to(this.fadeTime, {opacity: 255}, {
        easing: 'quadInOut',
        'onComplete': () => {
          // Nothing for now
        }
      })
      .start();
  }

  hideProgressBar() {
    tween(this.sliderOpacity)
      .to(this.fadeTime, {opacity: 0}, {
        easing: 'quadInOut',
        'onComplete': () => {
          this.progressBarVisible = false;
          this.slider.progress = 0;
          this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.HIDE_PROGRESS_BAR_COMPLETED]);
        }
      })
      .start();
  }

  updateProgress() {
    console.log("scene loading progress");
    console.log(this.sceneLoadingProgress);
    this.slider.progress = this.sceneLoadingProgress;
  }

}
