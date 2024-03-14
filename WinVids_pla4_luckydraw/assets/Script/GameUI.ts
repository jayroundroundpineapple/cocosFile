import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Prefab)
    private moneyPre:cc.Prefab = null
    @property(cc.Node)
    private ribbonNode:cc.Node = null;
    @property(cc.Node)
    private clickBtn: cc.Node = null;
    @property(cc.Node)
    private selectNode: cc.Node = null;
    @property(cc.Node)
    private girdNodeArr: cc.Node[] = []
    @property(cc.Node)
    private mask: cc.Node = null;
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Label)
    private tipLabel1: cc.Label = null;
    @property(cc.Sprite)
    private bg: cc.Sprite = null
    @property(cc.SpriteFrame)
    private bgArr: cc.SpriteFrame[] = []
    @property(cc.Node)
    private finger: cc.Node = null;
    @property(cc.Label)
    private monlabel: cc.Label = null;

    private num: number = 0
    private index: number = 0
    private monerChange: MoneyChange = null;
    private flag:boolean = false
    private amount: number = 0
    private bgmAudioFlag: boolean = true
    private originPos: any = null
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            if(this.bgmAudioFlag){
                cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, false, 1)
                this.bgmAudioFlag = false
            }
            if(this.flag){
                this.cashoutFunc()
            }
        })
        this.resize()
        this.clickBtn.on(cc.Node.EventType.TOUCH_START,this.doAnim,this)
        this.mask.active = this.finger.active = true
        this.ribbonNode.active  =this.selectNode.active = false
        this.selectNode.x = 0
        this.selectNode.y = 0
        this.schedule(this.autoAnim, 1,cc.macro.REPEAT_FOREVER,0)
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true, this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private doAnim() {
        Utils.SetScale(this.clickBtn,1.1,0.1,false)
        this.clickBtn.off(cc.Node.EventType.TOUCH_START,this.doAnim,this)
        cc.audioEngine.play(RESSpriteFrame.instance.RoundAudioClip,false,1)
        this.unschedule(this.autoAnim)
        this.mask.active = this.finger.active = false
        this.index = 0
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        this.selectNode.x = 0
        this.selectNode.y = 0
        this.selectNode.active = true
        let func = cc.callFunc(() => {
            this.num++
            this.selectNode.parent = this.girdNodeArr[this.index]
            this.girdNodeArr[this.index].children[0].zIndex = 2
            this.girdNodeArr[this.index].children[1].zIndex = 1
            this.index = (this.index + 1) % this.girdNodeArr.length
            if (this.num > 32) {
                this.selectNode.stopAllActions()
                let action1 = cc.fadeTo(0.23, 150)
                let action2 = cc.fadeTo(0.23, 255)
                let seq = cc.sequence([action1, action2, func])
                this.selectNode.runAction(seq)
            }
            if (this.num > 36) {
                // let pos = this.monlabel.node.parent.convertToWorldSpaceAR(cc.v2(this.monlabel.node.x,this.monlabel.node.y-100))
                // pos = this.node.convertToNodeSpaceAR(pos)
                setTimeout(() => {
                    this.monerChange.play(LanguageManager.instance.formatUnit(30),0.4,()=>{
                    },this)
                }, 800);
                let pos = Utils.getLocalPositionWithOtherNode(this.node,this.monlabel.node)
                Anim.ins().ShowFlyAni(this.moneyPre,this.node,10,pos,()=>{
                })
                this.selectNode.stopAllActions()
                cc.audioEngine.play(RESSpriteFrame.instance.numberAddAudioClip,false,1)
                this.ribbonNode.active = true
                this.flag = true
                cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                setTimeout(() => {
                    this.ribbonNode.active = false
                    this.index = 0
                    this.schedule(this.autoAnim,1)
                    this.mask.active = true
                    this.finger.active = true
                }, 4000);
            }
        })
        let action1 = cc.fadeTo(0.04, 150)
        let action2 = cc.fadeTo(0.04, 255)
        let seq = cc.sequence([action1, action2, func])
        let repeatAction = cc.repeatForever(seq)
        this.selectNode.runAction(repeatAction)
    }
    private autoAnim() {
        this.selectNode.active = true
        this.selectNode.parent = this.girdNodeArr[this.index]
        this.girdNodeArr[this.index].children[0].zIndex = 2
        this.girdNodeArr[this.index].children[1].zIndex = 1
        this.index = (this.index + 1) % this.girdNodeArr.length
        let action1 = cc.fadeTo(0.3, 150)
        let action2 = cc.fadeTo(0.3, 255)
        let seq = cc.sequence([action1, action2])
        let repeatAction = cc.repeatForever(seq)
        this.selectNode.runAction(repeatAction)
    }
    private secondClick(){

    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.bg.spriteFrame = isVerTical ? this.bgArr[0] : null
        if (isVerTical) {//竖屏
            if (cc.winSize.width / cc.winSize.height > 0.7) {
                cc.Canvas.instance.fitHeight = true;
                cc.Canvas.instance.fitWidth = false;
            } else {
                cc.Canvas.instance.fitHeight = false;
                cc.Canvas.instance.fitWidth = true;
            }
        } else {
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = false;
        }
        cc.director.getScene().getComponentsInChildren(cc.Widget).forEach(function (t) {
            t.updateAlignment()
        });
        this.tipLabel.node.active = isVerTical
        this.tipLabel1.node.active = !isVerTical
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
}   
