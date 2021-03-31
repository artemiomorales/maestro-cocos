import { Enum } from 'cc';

export var CONSTANTS = {
  APP_SETTINGS_PATH: "System Dependencies/App Settings",
}

export var EVENT_TYPE = Enum({
  SIMPLE: -1,
  COMPLEX: -1
})

export var SIMPLE_EVENT = Enum({
  ON_SWIPE_START: -1,
  ON_SWIPE: -1,
  ON_SWIPE_END: -1,
})

export var COMPLEX_EVENT = Enum({
  PLAY_AUDIO: -1,
  TRIGGER_SCENE_LOAD: -1
})

export var COMPLEX_PAYLOAD_KEY = Enum({
  AUDIO_CLIP_NAME: -1,
  LOOP: -1,
})