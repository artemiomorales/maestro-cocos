
import { _decorator, Component, Node, SystemEvent, macro, systemEvent, find, Vec2, CCFloat, SystemEventType, EventKeyboard } from 'cc';
import { CONSTANTS, SIMPLE_EVENT, SWIPE_DIRECTION } from '../constants';
import AppSettings from '../persistentData/appSettings';
import { ClampVectorValue, InvertV2Values } from '../utils';
const { ccclass, property } = _decorator;

@ccclass('KeyboardMonitor')
export default class KeyboardMonitor extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  @property({visible: true})
  private _inputActive: boolean = false;
  public get inputActive() {
    return this._inputActive;
  }
  public set inputActive(value: boolean) {
    this._inputActive = value;
  }

  @property({visible: true})
  private _doublePressed: boolean = false;
  public get doublePressed() {
    return this._doublePressed;
  }
  public set doublePressed(value: boolean) {
    this._doublePressed = value;
  }

  @property({visible: true})
  private _accelerate: boolean = false;
  public get accelerate() {
    return this._accelerate;
  }
  public set accelerate(value: boolean) {
    this._accelerate = value;
  }

  @property({visible: true})
  private _brake: boolean = false;
  public get brake() {
    return this._brake;
  }
  public set brake(value: boolean) {
    this._brake = value;
  }

  public get swipeForce() {
    return this.appSettings.getSwipeForce(this.node);
  }
  public set swipeForce(value: Vec2) {
    this.appSettings.setSwipeForce(this.node, value);
  }

  public get ySensitivity() {
    return this.appSettings.getYSensitivity(this.node);
  }

  public get invertYInput() {
    return this.appSettings.getInvertYInput(this.node);
  }

  public get xSensitivity() {
    return this.appSettings.getXSensitivity(this.node);
  }

  public get invertXInput() {
    return this.appSettings.getInvertYInput(this.node);
  }

  public get swipeDirection() {
    return this.appSettings.getSwipeDirection(this.node);
  }

  public set swipeDirection(value: string) {
    this.appSettings.setSwipeDirection(this.node, value);
  }

  public swipeMinMax = 80;

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    systemEvent.on(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    systemEvent.on(SystemEventType.KEY_UP, this.onKeyUp, this);
  }

  onDisable () {
    systemEvent.off(SystemEventType.KEY_DOWN, this.onKeyDown, this);
    systemEvent.off(SystemEventType.KEY_UP, this.onKeyUp, this)
  }

  update () {
    if(this.inputActive) {
      switch(this.swipeDirection) {

        case SWIPE_DIRECTION.yPositive:
          this.swipeForce = this.normalizeVectorInfo(new Vec2(0, 5), this.swipeMinMax);
          break;

        case SWIPE_DIRECTION.yNegative:
          this.swipeForce = this.normalizeVectorInfo(new Vec2(0, -5), this.swipeMinMax);
          break;

        case SWIPE_DIRECTION.xPositive:
          this.swipeForce = this.normalizeVectorInfo(new Vec2(2.5, 0), this.swipeMinMax);
          break;

        case SWIPE_DIRECTION.xNegative:
          this.swipeForce = this.normalizeVectorInfo(new Vec2(-2.5, 0), this.swipeMinMax);
          break;
      }
      
      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE])
    }
  }

  onKeyDown (event: EventKeyboard) {

    const updateStatus = () => {
      if(!this.inputActive) {
        this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START])
      }
      this.inputActive = true;
      
    }

    switch(event.keyCode) {

      case macro.KEY.down:
        this.swipeDirection = SWIPE_DIRECTION.yPositive;
        updateStatus();
        break;

      case macro.KEY.up:
        this.swipeDirection = SWIPE_DIRECTION.yNegative;
        updateStatus();
        break;

      case macro.KEY.left:
        this.swipeDirection = SWIPE_DIRECTION.xNegative;
        updateStatus();
        break;

      case macro.KEY.right:
        this.swipeDirection = SWIPE_DIRECTION.xPositive;
        updateStatus();
        break;

      case macro.KEY.z:
        this.accelerate = true;
        break;
      

      case macro.KEY.x:
        this.brake = true;
        break;
    }

    
  }

  onKeyUp (event: EventKeyboard) {
    switch(event.keyCode) {
      case macro.KEY.down:
      case macro.KEY.up:
      case macro.KEY.left:
      case macro.KEY.right:
        this.inputActive = false;
        this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END])
        break;
      
      case macro.KEY.z:
        this.accelerate = false;

      case macro.KEY.x:
        this.brake = false;
    }
  }

  normalizeVectorInfo (rawVector: Vec2, minMax: number)
  {
    // Clamp swipe values based on max/min threshold
    const clampedVector: Vec2 = ClampVectorValue(rawVector, minMax);

    // Due to the peculiarities of working with Unity's timeline system,
    // the X value always comes in opposite of what we need. In some instances,
    // scrolling vertically for example, we also need to inver the Y.
    let correctedV2: Vec2;

      if(this.invertYInput == true) {
        if(this.invertXInput == true) {
            correctedV2 = InvertV2Values(clampedVector, ["x", "y"]);
        } else {
            correctedV2 = InvertV2Values(clampedVector, ["y"]);
        }
      } else {
        if (this.invertXInput == true) {
            correctedV2 = InvertV2Values(clampedVector, ["x"]);
        } else {
            correctedV2 = clampedVector;
        }
      }

    let v2Force: Vec2;

    // Normalize information based on sensitivity, otherwise our values come back too high
    if (this.accelerate) {
        v2Force = new Vec2(correctedV2.x * (this.xSensitivity * 2), correctedV2.y * (this.ySensitivity * 2));
    } else if (this.brake) {
        v2Force = new Vec2(correctedV2.x * (this.xSensitivity / 2), correctedV2.y * (this.ySensitivity / 2));
    } else {
        v2Force = new Vec2(correctedV2.x * this.xSensitivity, correctedV2.y * this.ySensitivity);
    }
        
    return v2Force;
  }

}