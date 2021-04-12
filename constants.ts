import { Enum } from 'cc';

export var CONSTANTS = {
  APP_SETTINGS_PATH: "System Dependencies/App Settings"  
}

export var EVENT_TYPE = Enum({
  SIMPLE: -1,
  COMPLEX: -1
})

export var SIMPLE_EVENT = Enum({
  ON_SWIPE_START: -1,
  ON_SWIPE: -1,
  ON_SWIPE_END: -1,
  ON_MOMENTUM: -1,
  FADE_TO_BLACK_COMPLETED: -1,
  SCENE_LOAD_COMPLETED: -1,
  FADE_IN_COMPLETED: -1,
})

export var COMPLEX_EVENT = Enum({
  PLAY_AUDIO: -1,
  TRIGGER_SCENE_LOAD: -1,
  TRIGGER_FADE_TO_BLACK: -1,
})

export var COMPLEX_PAYLOAD_KEY = Enum({
  AUDIO_CLIP_NAME: -1,
  LOOP: -1,
})

export var DATA_TYPE = Enum({
  intType: -1,
  stringType: -1,
  floatType: -1,
  boolType: -1,
  audioClipType: -1
})

export enum SWIPE_DIRECTION {
  yPositive = "yPositive",
  yNegative = "yNegative",
  xPositive = "xPositive",
  xNegative = "xNegative",
}