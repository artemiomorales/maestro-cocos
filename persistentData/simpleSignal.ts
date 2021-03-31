
import { _decorator, Component, Node } from 'cc';
import { ISimpleSignalListener } from '../iSimpleSignalListener';
import { PersistentDataObject } from './persistentDataObject';
const { ccclass, property } = _decorator;

@ccclass('SimpleSignal')
export class SimpleSignal extends PersistentDataObject {
    
  private _listeners: ISimpleSignalListener[] = [];
  private get listeners() {
    return this._listeners;
  }
  private set listeners(value: ISimpleSignalListener[]) {
    this._listeners = value;
  }

  signalChange() {
    this.sanitizeListenerList();

    for (let i = this.listeners.length - 1; i >= 0; i--) {
      // if (logListenersOnRaise == true || AppSettings.logEventCallersAndListeners == true) {
      //     LogListenerOnRaise(listeners[i]);
      // }
      this.listeners[i].onEventRaised();
    }

    this.clearCaller();
  }

  sanitizeListenerList() {
    let sanitizedList: ISimpleSignalListener[] = [];
    this.listeners.forEach(item => {
      if(item) {
        sanitizedList.push(item);
      }
    });
    this.listeners = sanitizedList;
  }


}
