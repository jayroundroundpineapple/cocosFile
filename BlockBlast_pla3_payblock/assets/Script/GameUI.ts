import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private maxBg:cc.Node = null
    @property(cc.Node)
    private verTicalBg:cc.Node = null
    @property(cc.SpriteFrame)
    private bgsprite:cc.SpriteFrame = null
    @property(cc.Prefab)
    private monPrefab:cc.Prefab = null;
    @property(cc.Node)
    private boxBg:cc.Node = null;
    @property(cc.Node)
    private system:cc.Node = null
    @property(cc.Label)
    private DragLb:cc.Label = null
    @property(cc.Label)
    private RevLb:cc.Label = null
    @property(cc.Node)
    private slideBox: cc.Node = null
    @property(cc.Node)
    private targetNode: cc.Node = null
    @property(cc.Node)
    private targetBox: cc.Node = null
    @property(cc.Node)
    private mask: cc.Node = null;
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Label)
    private tipLabel1: cc.Label = null;
    @property(cc.Label)
    private monlabel: cc.Label = null;
    @property(cc.Node)
    private resultNode: cc.Node = null;
    @property(cc.Node)
    private arrowNode:cc.Node = null;

    private canJump:boolean = false
    private isLongScreen:boolean = false
    private originPos:cc.Vec3 = null
    private targetPos:any = null
    private Max_Delta: number = 50 //边界阈值
    private monerChange: MoneyChange = null;
    private amount: number = 0
    private bgmAudioFlag: boolean = true
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            this.bgmAudioFlag && cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, false, 1)
            this.bgmAudioFlag = false
            if(this.canJump){
                this.cashoutFunc()
            }
        })
        this.resize()
        this.RevLb.node.active = this.system.active = false
        this.originPos = this.targetNode.position
        this.targetPos = this.targetBox.parent.convertToWorldSpaceAR(this.targetBox.position)
        this.targetPos = this.targetNode.parent.convertToNodeSpaceAR(this.targetPos)
        this.targetNode.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
        this.targetNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
        this.targetNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        this.resultNode.active = this.mask.active = false
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true,this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
        this.doAnim()
    }
    private touchStart(e) {
        this.arrowNode.active = false
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
        this.targetNode.scale = .8
    }
    private touchMove(e) {
        let delta = e.getDelta()
        this.targetNode.x += delta.x
        this.targetNode.y += delta.y
        let pos = e.getLocation()
        pos = this.targetNode.parent.convertToNodeSpaceAR(pos)
        // this.judgeFunc(pos)
    }
    private touchEnd(e) {
        // let pos = e.getLocation()
        let pos = this.targetBox.parent.convertToWorldSpaceAR(this.targetBox.position)
        pos = this.targetNode.parent.convertToNodeSpaceAR(pos)
        // this.judgeFunc(pos)
        cc.tween(this.targetNode).delay(0.1)
        .to(.6,{position:pos},{easing:'quadOut'})
        .call(()=>{
            let pos =   Utils.getLocalPositionWithOtherNode(this.node,this.monlabel.node)
            cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip,false,1)
            Anim.ins().ShowFlyAni(this.monPrefab,this.node,15,pos,()=>{},this)
            this.system.active = true
            setTimeout(()=>{
                let id = cc.audioEngine.play(RESSpriteFrame.instance.numberAddAudioClip,false,1)
                this.monerChange.play(LanguageManager.instance.formatUnit(300),1.3,()=>{
                    cc.audioEngine.pause(id)
                    this.DragLb.node.active = false
                    this.RevLb.node.active = this.mask.active = true
                    Utils.showUI(this.resultNode,RESSpriteFrame.instance.comeOutAudioClip,0.3,true,1.1,1,()=>{
                        cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                        this.canJump = true
                    })
            },this)
            },500)
            let childs = this.boxBg.children
            for(let i = 0; i < childs.length;i++){
                childs[i].destroy()
            }
            this.targetNode.active = false
        })
        .start()
    }
    private judgeFunc(pos){
        console.log(pos,this.targetBox.position);
        if(pos.x > this.targetPos.x - this.Max_Delta && pos.x < this.targetPos.x + this.Max_Delta && pos.y > this.targetPos.y - this.Max_Delta && pos.y < this.targetPos.y + this.Max_Delta){  
                console.log('jaytrue');
                this.targetNode.parent = this.targetBox
                this.targetNode.x = this.targetNode.y = 0
        }else{
            this.targetNode.scale = .6
            this.targetNode.position = this.originPos
        }
    }
    private doAnim() {
            cc.tween(this.slideBox)
            .to(8,{x:-1772})
            .call(()=>{
                this.slideBox.x = 650
                this.doAnim()
            })
            .start()
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.maxBg.active = !isVerTical
        this.verTicalBg.getComponent(cc.Sprite).spriteFrame = isVerTical ? this.bgsprite : this.bgsprite
        this.isLongScreen = cc.winSize.height > 1400 ? true : false
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
        EffectUtils.removeTweens(this.DragLb.node)
        EffectUtils.removeTweens(this.RevLb.node)
        this.verTicalBg.getComponent(cc.Widget).right = isVerTical ? 0 : cc.winSize.width / 5
        this.mask.getComponent(cc.Widget).right = isVerTical ? 0 : cc.winSize.width / 5
        this.resultNode.getComponent(cc.Widget).right = isVerTical ? 0 : cc.winSize.width / 5
        if(this.isLongScreen){
            Utils.SetScale(this.DragLb.node,1.6,1.5,0.3,true)
            Utils.SetScale(this.RevLb.node,1.6,1.5,0.3,true)
        }else{
            Utils.SetScale(this.DragLb.node,1.1,1,0.3,true)
            Utils.SetScale(this.RevLb.node,1.1,1,0.3,true)
        }
        this.DragLb.node.getComponent(cc.Widget).top = this.isLongScreen ? 225 : 160 
        this.RevLb.node.getComponent(cc.Widget).top = this.isLongScreen ? 225 : 160
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
