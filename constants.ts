import { Enum } from 'cc';

export var CONSTANTS = {
  APP_SETTINGS_PATH: "System Dependencies/AppSettings",
  SCENE_DATA_PATH: "Logic/SceneData"
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

export var AXIS_TYPE = Enum({
  X: -1,
  Y: -1
})

export var SIMPLE_EVENT = Enum({
  BLANK: -1,
  ON_TOUCH_START: -1,
  ON_SWIPE: -1,
  ON_SWIPE_END: -1,
  ON_MOMENTUM: -1,
  FADE_TO_BLACK_COMPLETED: -1,
  SCENE_LOAD_COMPLETED: -1,
  FADE_IN_COMPLETED: -1,
  SEQUENCE_CONFIGURATION_COMPLETE: -1,
  AUTOPLAY_ACTIVATE: -1,
  TOUCH_CONTROLLER_CONFIGURATION_COMPLETE: -1,
  TRIGGER_SHOW_PROGRESS_BAR: -1,
  TRIGGER_HIDE_PROGRESS_BAR: -1,
  HIDE_PROGRESS_BAR_COMPLETED: -1,
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
  ON_SEQUENCE_SHOULD_REFRESH_ELAPSED_TIME: -1,
  ON_SEQUENCE_BOUNDARY_REACHED: -1,
  ON_SEQUENCE_ACTIVATED: -1,
  ON_SEQUENCE_DEACTIVATED: -1,
  ACTIVATE_NEXT_SEQUENCE: -1,
  ACTIVATE_PREVIOUS_SEQUENCE: -1,
  SET_FORK_DESTINATION: -1,
  SET_NEXT_DESTINATION_STATUS: -1,
  SET_PREVIOUS_DESTINATION_STATUS: -1
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

export enum DESTINATION_TYPE {
  previous = "previous",
  next = "next"
}

export var DESTINATION_ACTIVATION_TYPE = Enum({
  SET_TO_END: -1,
  SET_TO_BEGINNING: -1
});

export enum INVERT_STATUS {
  normal = "normal",
  inverted = "inverted"
}

export enum SWIPE_DIRECTION {
  yPositive = "yPositive",
  yNegative = "yNegative",
  xPositive = "xPositive",
  xNegative = "xNegative"
}