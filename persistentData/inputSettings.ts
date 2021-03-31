
import { _decorator, Component, Node, v2, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputSettings')
export default class InputSettings {
    
    @property({type: Vec2})
    public swipeForce: Vec2 = v2(0,0)
    
}