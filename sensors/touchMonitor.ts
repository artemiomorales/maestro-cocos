import { _decorator, Component, systemEvent, SystemEvent, AnimationComponent, Touch, log, v2, Vec2, find, Node } from 'cc';
import { CONSTANTS, SIMPLE_EVENT, SWIPE_DIRECTION } from '../constants';
import AppSettings from '../persistentData/appSettings';
import { GetV2Sign, ClampVectorValue, InvertV2Values, ExponentiateV2, GetVector2Direction } from '../utils';

const { ccclass, property } = _decorator;

@ccclass('TouchMonitor')
export class TouchMonitor extends Component {

  @property({type: Node, visible: false})
  public appSettingsNode: Node = null!;
  private appSettings: AppSettings = null!;

  private _gestureStartTime = 0;

  public get isTouching() {
    return this.appSettings.getIsTouching(this.node);
  }
  public set isTouching(value: boolean) {
    this.appSettings.setIsTouching(this.node, value);
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

  public get isSwiping() {
    return this.appSettings.getIsSwiping(this.node);
  }
  public set isSwiping(value: boolean) {
    this.appSettings.setIsSwiping(this.node, value);
  }
  
  public get swipeForce() {
    return this.appSettings.getSwipeForce(this.node);
  }
  public set swipeForce(value: Vec2) {
    this.appSettings.setSwipeForce(this.node, value);
  }

  public gestureActionTime = 0;
  public touchStartPosition = v2(0, 0);
  public touchPreviousPosition = v2(0, 0);
  public touchCurrentPosition = v2(0, 0);

  public swipeMinMax = 80;

  // public flickThreshold = 1000;
  // public isFlicked = false;

  public get touchMonitorMomentum() {
    return this.appSettings.getTouchMonitorMomentum(this.node);
  }
  public set touchMonitorMomentum(value: Vec2) {
    this.appSettings.setTouchMonitorMomentum(this.node, value);
  }

  public touchMonitorMomentumCache = v2(0, 0);

  public momentumMinMax = 2000;
  public momentumDecay = .95;
  public momentumSensitivity = 1;

  @property
  public gestureTimeMultiplier = 50;

  public cancelMomentumTimeThreshold = .2;
  public cancelMomentumMagnitudeThreshold = 815;
  public pauseMomentumThreshold = .03;

  public get swipeDirection() {
    return this.appSettings.getSwipeDirection(this.node);
  }
  public set swipeDirection(value: string) {
    this.appSettings.setSwipeDirection(this.node, value);
  }

  public hasMomentum = false;

  public swipeHistory: Vec2[] = [];
  public swipeHistoryIndex = 0;

  @property({type:Node})
  public listeners: Node[] = [];


  start() {
    this.appSettingsNode = find(CONSTANTS.APP_SETTINGS_PATH) as Node;
    this.appSettings = this.appSettingsNode.getComponent(AppSettings) as AppSettings;
  }

  update() {
    if(this.hasMomentum == true) {
      // All momentum is executed through momentumForce. However, we calculate the momentumForce
      // via a momentumCache, which is modified dynamically based on swipe input, decay value, etc.
      this.touchMonitorMomentum = v2(this.touchMonitorMomentumCache.x, this.touchMonitorMomentumCache.y);

      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_MOMENTUM])

      if (this.touchMonitorMomentum.dot(this.touchMonitorMomentum) < .00001) {
        // momentumDepleted.RaiseEvent(this.gameObject);
        this.touchMonitorMomentumCache = v2(0, 0);
        this.hasMomentum = false;
      } else {
        this.touchMonitorMomentumCache = v2(this.touchMonitorMomentumCache.x * this.momentumDecay, this.touchMonitorMomentumCache.y * this.momentumDecay);            
      }
      
    }
  }

  onLoad () {
    systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
    systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
    systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onDestroy() {
    systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
    systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
    systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchStart(event: Touch) {
    let location = event.getLocation();// 获取节点坐标
    this.touchStartPosition = v2(location.x, location.y);
    this.touchCurrentPosition = v2(location.x, location.y);
    this.touchPreviousPosition = v2(location.x, location.y);
    this.isTouching = true;
    this._gestureStartTime = Date.now();
    this.haltMomentum();

    this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_TOUCH_START])
  }

  onTouchMove(event: Touch) {
      this.touchCurrentPosition = event.getLocation();
      const swipeVector = v2(
        (this.touchPreviousPosition.x - this.touchCurrentPosition.x) * -1,
        (this.touchPreviousPosition.y - this.touchCurrentPosition.y) * -1
      );

      // log(swipeVector.y);

      // log(deltaX);
      // log(deltaY);
      // log(this);

      if(this.hasMomentum == true) {
        const swipeSign = GetV2Sign(swipeVector);
        const momentumSign = GetV2Sign(this.touchMonitorMomentum);

        if(swipeSign != momentumSign) {
          this.haltMomentum();
        }
      }

      const newSwipeForce: Vec2 = this.normalizeVectorInfo(swipeVector, this.swipeMinMax);
      this.swipeForce = newSwipeForce;

      this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE])

      this.touchPreviousPosition = this.touchCurrentPosition;
      // onSwipe.RaiseEvent(this.gameObject);
  }

  onTouchEnd(event: Touch) {
    this.isTouching = false;
    // Raise flick event - TO DO

    this.gestureActionTime = (Date.now() - this._gestureStartTime) / 1000;

    const delta = v2(Math.abs(this.touchStartPosition.x - this.touchCurrentPosition.x), Math.abs(this.touchStartPosition.y - this.touchCurrentPosition.y));

    console.log(delta);
    console.log(delta.dot(delta));

    // Cancel momentum on certain long swipe gestures with low delta at the end of the movement.
    if((delta.dot(delta) < this.cancelMomentumMagnitudeThreshold && this.gestureActionTime > this.cancelMomentumTimeThreshold) || delta.dot(delta) === 0) {
      this.haltMomentum();
        // Raise events
        // momentumDepleted.RaiseEvent(this.gameObject);
        // onSwipeEnd.RaiseEvent(this.gameObject);
        return;
    }

    const swipeVector = v2(this.touchCurrentPosition.x - this.touchStartPosition.x, this.touchCurrentPosition.y - this.touchStartPosition.y);

    // log("current position");
    // log(this.touchCurrentPosition.y);
    // log("start position");
    // log(this.touchStartPosition.y);

    // We use momentumMinMax to clamp the value, but as of this writing that
    // value is set to 1000, which means that most swipes won't get clamped at all.
    // I leave this functionality here in case we do need to use it at some point.      
    const swipeEndForce = this.normalizeVectorInfo(swipeVector, this.momentumMinMax);

    // Using swipeEndForce, run through a function that
    // allows us to adjust momentum sensitivity, if desired
    const swipeMomentum = ExponentiateV2(swipeEndForce, this.momentumSensitivity);

    //log("swipe momentum");
    //log(swipeMomentum);

    // Our swipe time generally comes back less than 1 - so let's multiply
    // by 100, because dividing by a decimal makes our swipe too intense
    const normalizedGestureTime = this.gestureActionTime * this.gestureTimeMultiplier;

    //log("normalized gesture time");
    //log(normalizedGestureTime);

    this.addMomentum(v2(swipeMomentum.x / normalizedGestureTime, swipeMomentum.y / normalizedGestureTime));

    this.isSwiping = false;
    
    this.appSettings.triggerSimpleEvent(this.node, Object.keys(SIMPLE_EVENT)[SIMPLE_EVENT.ON_SWIPE_END])

    //log(swipeEndForce);
  
    // onSwipeEnd.RaiseEvent(this.gameObject);
  }

  addMomentum(momentumVector: Vec2) {
    const momentumAdd = v2(this.touchMonitorMomentumCache.x + momentumVector.x, this.touchMonitorMomentum.y + momentumVector.y);
    this.touchMonitorMomentumCache = momentumAdd;
    this.hasMomentum = true;
  }

  getSwipeDirection(touchMonitor: TouchMonitor, deltaPosition: Vec2)
  {
      this.updateSwipeHistory(touchMonitor, deltaPosition);
      const vectorDirection = GetVector2Direction(touchMonitor.swipeHistory, touchMonitor.invertXInput,
          touchMonitor.invertYInput);
          
      if (Math.abs(vectorDirection.x) > Math.abs(vectorDirection.y)) {
          return vectorDirection.x > 0 ? SWIPE_DIRECTION.xPositive : SWIPE_DIRECTION.xNegative;
      }
      
      return vectorDirection.y > 0 ? SWIPE_DIRECTION.yPositive : SWIPE_DIRECTION.yNegative;
  }

  updateSwipeHistory(touchMonitor: TouchMonitor, deltaPosition: Vec2)
  {
      if (touchMonitor.swipeHistoryIndex < touchMonitor.swipeHistory.length - 1) {
          touchMonitor.swipeHistory[touchMonitor.swipeHistoryIndex] = deltaPosition;
      }

      touchMonitor.swipeHistoryIndex++;
      if (touchMonitor.swipeHistoryIndex > touchMonitor.swipeHistory.length - 1) {
          touchMonitor.swipeHistoryIndex = 0;
      }
      
      return touchMonitor.swipeHistory;
  }

  haltMomentum() {
    this.hasMomentum = false;
    this.touchMonitorMomentum = v2(0, 0);
    this.touchMonitorMomentumCache = v2(0, 0);
  }

  normalizeVectorInfo(rawVector: Vec2, minMax: number)
  {
      // Clamp swipe values based on max/min threshold
      const clampedVector = ClampVectorValue(rawVector, minMax);

      // Due to the peculiarities of working with Unity's timeline system,
      // the X value always comes in opposite of what we need. In some instances,
      // scrolling vertically for example, we also need to invert the Y.
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

      // Normalize information based on sensitivity, otherwise our values come back too high
      const v2Force = v2(correctedV2.x * this.xSensitivity, correctedV2.y * this.ySensitivity);

      return v2Force;
  }

}
