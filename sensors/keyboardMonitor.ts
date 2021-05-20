
import { _decorator, Component, Node, SystemEvent, macro, systemEvent, find, Vec2, CCFloat } from 'cc';
import { CONSTANTS, SIMPLE_EVENT } from '../constants';
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

  @property({visible: true})
  private _firstButtonPressed: boolean = false;
  public get firstButtonPressed() {
    return this._firstButtonPressed;
  }
  public set firstButtonPressed(value: boolean) {
    this._firstButtonPressed = value;
  }

  @property({type: CCFloat, visible: true})
  private _timeOfFirstButton: number = 0;
  public get timeOfFirstButton() {
    return this._timeOfFirstButton;
  }
  public set timeOfFirstButton(value: number) {
    this._timeOfFirstButton = value;
  }

  @property({visible: true})
  private _isReversing: boolean = false;
  public get isReversing() {
    return this._isReversing;
  }
  public set isReversing(value: boolean) {
    this._isReversing = value;
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
    return this.appSettings.getInverYInput(this.node);
  }

  public get xSensitivity() {
    return this.appSettings.getXSensitivity(this.node);
  }

  public get invertXInput() {
    return this.appSettings.getInverYInput(this.node);
  }

  public swipeMinMax = 80;

  start () {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;

    systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  onDisable () {
    systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this)
  }

  update () {
    if(this.inputActive) {
      if(!this.isReversing) {
        this.swipeForce = this.NormalizeVectorInfo(new Vec2(0, 1), this.swipeMinMax);
      } else {
        this.swipeForce = this.NormalizeVectorInfo(new Vec2(0, -1), this.swipeMinMax);
      }
      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE])
    }
  }

  onKeyDown (event: any) {
    switch(event.keyCode) {
      case macro.KEY.down:
        this.updateDoublePressed();
        if(!this.inputActive) {
          this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START])
        }
        this.inputActive = true;
        this.isReversing = false;
        break;

      case macro.KEY.up:
        this.updateDoublePressed();
        if(!this.inputActive) {
          this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START])
        }
        this.inputActive = true;
        this.isReversing = true;
        break;
      
      case macro.KEY.shift:
        this.accelerate = true;

      case macro.KEY.ctrl:
        this.brake = true;
    }
  }

  onKeyUp (event: any) {
    switch(event.keyCode) {
      case macro.KEY.down:
      case macro.KEY.up:
        this.inputActive = false;
        this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END])
        break;
      
      case macro.KEY.shift:
        this.accelerate = false;

      case macro.KEY.ctrl:
        this.brake = false;
    }
  }

  updateDoublePressed() : void
  {
    let reset = false;
    if (this.firstButtonPressed) {
      if (new Date().getTime() - this.timeOfFirstButton < 0.5) {
          this.doublePressed = true;
      }

      reset = true;
    }

    if (!this.firstButtonPressed) {
      this.firstButtonPressed = true;
      this.timeOfFirstButton = new Date().getTime();
    }

    if (reset) {
      this.firstButtonPressed = false;
    }
  }

  NormalizeVectorInfo (rawVector: Vec2, minMax: number)
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
    if (this.doublePressed) {
        v2Force = new Vec2(correctedV2.x * (this.xSensitivity * 5), correctedV2.y * (this.ySensitivity * 5));
    } else if (this.accelerate) {
        v2Force = new Vec2(correctedV2.x * (this.xSensitivity * 3), correctedV2.y * (this.ySensitivity * 3));
    } else if (this.brake) {
        v2Force = new Vec2(correctedV2.x * (this.xSensitivity / 2), correctedV2.y * (this.ySensitivity / 2));
    } else {
        v2Force = new Vec2(correctedV2.x * this.xSensitivity, correctedV2.y * this.ySensitivity);
    }
        
    return v2Force;
  }

}