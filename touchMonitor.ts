import { _decorator, Component, systemEvent, SystemEvent, AnimationComponent, Touch, log, v2, Vec2 } from 'cc';
import { GetV2Sign, ClampVectorValue, InvertV2Values, ExponentiateV2, GetVector2Direction } from './utils';

const { ccclass, property } = _decorator;

enum SwipeDirection {
  yPositive = "yPositive",
  yNegative = "yNegative",
  xPositive = "xPositive",
  xNegative = "xNegative",
}

@ccclass('TouchMonitor')
export class TouchMonitor extends Component {

    private _pressedX = 0;
    private _pressedY = 0;

    private _gestureStartTime = 0;

    public isTouching = false;

    public ySensitivity = .0027;
    public invertYInput = false;

    public xSensitivity = .0054;
    public invertXInput = false;

    public isSwiping = false;
    public swipeForce = v2(0, 0);

    public gestureActionTime = 0;
    public touchStartPosition = v2(0, 0);
    public touchCurrentPosition = v2(0, 0);

    public swipeMinMax = 80;

    // public flickThreshold = 1000;
    // public isFlicked = false;

    public touchMonitorMomentum = v2(0, 0);
    public touchMonitorMomentumCache = v2(0, 0);

    public momentumMinMax = 2000;
    public momentumDecay = .95;
    public momentumSensitivity = 1;

    public gestureTimeMultiplier = 50;
    public cancelMomentumTimeThreshold = .2;
    public cancelMomentumMagnitudeThreshold = 815;
    public pauseMomentumThreshold = .03;

    public swipeDirection = "";
    public hasMomentum = false;

    public swipeHistory: Vec2[] = [];
    public swipeHistoryIndex = 0;

    public anim: any = null;
    public animState: any = null;
    public currentTime: number = 0;

    update() {
      if(this.hasMomentum == true) {
        // All momentum is executed through momentumForce. However, we calculate the momentumForce
        // via a momentumCache, which is modified dynamically based on swipe input, decay value, etc.
        this.touchMonitorMomentum = v2(this.touchMonitorMomentumCache.x, this.touchMonitorMomentumCache.y);
				
				// momentumUpdate.RaiseEvent(this.gameObject);
				
				if (this.touchMonitorMomentum.dot(this.touchMonitorMomentum) < .00001) {
          // momentumDepleted.RaiseEvent(this.gameObject);
          this.touchMonitorMomentumCache = v2(0, 0);
          this.hasMomentum = false;
				} else {
					this.touchMonitorMomentumCache = v2(this.touchMonitorMomentumCache.x * this.momentumDecay, this.touchMonitorMomentumCache.y * this.momentumDecay);            
				}
        log(this.touchMonitorMomentumCache);
      }
    }

    onLoad () {
      systemEvent.on(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
      systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
      systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: Touch) {
      log("touch started");
      let location = event.getLocation();// 获取节点坐标
      this.touchStartPosition = v2(location.x, location.y);
      this.isTouching = true;
      this._gestureStartTime = Date.now();

      // onTouchStart.RaiseEvent(this.gameObject);
    }

    onTouchMove(event: Touch) {
        let touchPoint = event.getLocation();
        this.touchCurrentPosition = touchPoint;
        const deltaX = this._pressedX - touchPoint.x;
        const deltaY = this._pressedY - touchPoint.y;
        const swipeVector = v2(deltaX, deltaY);
    
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

        // onSwipe.RaiseEvent(this.gameObject);
    }

    onTouchEnd(event: Touch) {
      let touchPoint = event.getLocation();
      this.isTouching = false;
      // Raise flick event - TO DO

      this.gestureActionTime = Date.now() - this._gestureStartTime;

      const delta = v2(this.touchCurrentPosition.x - touchPoint.x, this.touchCurrentPosition.y - touchPoint.y);

      log(delta);

      // Cancel momentum on certain long swipe gestures with low delta at the end of the movement.
      if(delta.dot(delta) < this.cancelMomentumMagnitudeThreshold && this.gestureActionTime > this.cancelMomentumTimeThreshold) {
        this.haltMomentum();
          // Raise events
          // momentumDepleted.RaiseEvent(this.gameObject);
          // onSwipeEnd.RaiseEvent(this.gameObject);
          return;
      }

      const swipeVector = v2(touchPoint.x - this.touchStartPosition.x, touchPoint.y - this.touchStartPosition.y);

      // We use momentumMinMax to clamp the value, but as of this writing that
      // value is set to 1000, which means that most swipes won't get clamped at all.
      // I leave this functionality here in case we do need to use it at some point.      
      const swipeEndForce = this.normalizeVectorInfo(swipeVector, this.momentumMinMax);

      // Using swipeEndForce, run through a function that
      // allows us to adjust momentum sensitivity, if desired
      const swipeMomentum = ExponentiateV2(swipeEndForce, this.momentumSensitivity);

      // Our swipe time generally comes back less than 1 - so let's multiply
      // by 100, because dividing by a decimal makes our swipe too intense
      const normalizedGestureTime = this.gestureActionTime * this.gestureTimeMultiplier;

      this.addMomentum(v2(swipeMomentum.x / normalizedGestureTime, swipeMomentum.y / normalizedGestureTime));

      this.isSwiping = false;

      log(swipeEndForce);
    
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
            return vectorDirection.x > 0 ? SwipeDirection.xPositive : SwipeDirection.xNegative;
        }
        
        return vectorDirection.y > 0 ? SwipeDirection.yPositive : SwipeDirection.yNegative;
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

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.onTouchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}
