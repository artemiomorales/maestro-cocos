import { _decorator, Component, AnimationComponent, Node, AnimationState, AnimationClip, CCFloat, find } from 'cc';
import AppSettings from '../persistentData/appSettings';

import { CONSTANTS } from '../constants';

const { ccclass, property } = _decorator;

@ccclass('SequenceController')
export default class SequenceController extends Component {
    
  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({visible: true})
  private _active = true;
  public get active() {
    return this._active;
  }
  public set active(value: boolean) {
    this._active = value;
  }

  @property({type: CCFloat, visible: true})
  private _currentTime: number = 0;
  public get currentTime() {
    return this._currentTime;
  }
  public set currentTime(value: number) {
    this._currentTime = value;
  }

  @property({type: CCFloat, visible: true})
  private _duration: number = 0;
  public get duration() {
    return this._duration;
  }
  public set duration(value: number) {
    this._duration = value;
  }

  @property({type: AnimationClip, visible: true})
  private _animationClip: AnimationClip = null!;
  public get animationClip() {
    return this._animationClip;
  }
  public set animationClip(value: AnimationClip) {
    this._animationClip = value;
  }

  @property({type:AnimationComponent, visible: true})
  public _animationComponent: AnimationComponent = null!;
  public get animationComponent() {
    return this._animationComponent;
  }
  public set animationComponent(value: AnimationComponent) {
    this._animationComponent = value;
  }

  private _animState: AnimationState = null!;
  public get animState() {
    return this._animState;
  }
  public set animState(value: AnimationState) {
    this._animState = value;
  }

  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    if(this.animationComponent.defaultClip !== null) {
      this.animationClip = this.animationComponent.defaultClip;
      this.animationComponent.play(this.animationClip.name);
      this.animState = this.animationComponent.getState(this.animationClip.name);
      this.animState.speed = 0;
    }

  }

  init() {
    
  }

  modifySequenceTime(modifier: number) {
    const newTime = this.animState.time + modifier;

    console.log("inside sequence controller");
    console.log(newTime);


    if(newTime < 0) {
      this.animState.time = 0;
    }

    else if(newTime > this.animationClip.duration) {
      this.animState.time = this.animationClip.duration;
    }

    else {
      this.animState.time = newTime;
    }

  }
}
