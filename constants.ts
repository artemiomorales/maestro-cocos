import { Enum } from 'cc';

export var CONSTANTS = {
  APP_SETTINGS_PATH: "System Dependencies/App Settings",
  SCENE_DATA_PATH: "Logic/Scene Data"
}

export var EVENT_TYPE = Enum({
  SIMPLE: -1,
  COMPLEX: -1
})

export var COMPARISON_VALUES = Enum({
  EQUAL_TO: -1,
  NOT_EQUAL_TO: -1,
  GREATER_THAN: -1,
  LESS_THAN: -1
})

export var SIMPLE_EVENT = Enum({
  ON_TOUCH_START: -1,
  ON_SWIPE: -1,
  ON_SWIPE_END: -1,
  ON_MOMENTUM: -1,
  FADE_TO_BLACK_COMPLETED: -1,
  SCENE_LOAD_COMPLETED: -1,
  FADE_IN_COMPLETED: -1,
  SEQUENCE_CONFIGURATION_COMPLETE: -1,
  AUTOPLAY_ACTIVATE: -1
})

export var COMPLEX_EVENT = Enum({
  TRIGGER_SCENE_LOAD: -1,
  PLAY_AUDIO: -1,
  PLAY_ONE_SHOT: -1,
  FADE_OUT_AUDIO: -1,
  TRIGGER_FADE_TO_BLACK: -1
})

export var INTERNAL_COMPLEX_EVENT = Enum({
  ON_SEQUENCE_UPDATED: -1,
  ON_SEQUENCE_BOUNDARY_REACHED: -1,
  ON_SEQUENCE_DEACTIVATED: -1,
  ACTIVATE_NEXT_SEQUENCE: -1,
  ACTIVATE_PREVIOUS_SEQUENCE: -1
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