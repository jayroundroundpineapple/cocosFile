import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import TurnTable from "./TurnTable";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private maxBg:cc.Node = null
    @property(cc.Prefab)
    private moneyPrefab:cc.Prefab = null
    @property(cc.Sprite)
    private maskSprite:cc.Sprite = null;
    @property(cc.Mask)
    private maskNode:cc.Mask = null;
    @property(cc.Node)
    private scratchNode:cc.Node = null
    @property(cc.Node)
    private scratSystem:cc.Node = null
    @property(cc.Node)
    private scratchFinger:cc.Node = null
    @property(cc.Node)
    private table:cc.Node = null
    @property(cc.Node)
    private mask:cc.Node = null;
    @property(cc.Label)
    private tipLabel:cc.Label = null;
    @property(cc.Label)
    private tipLabel1:cc.Label = null;
    @property(cc.Sprite)
    private bg:cc.Sprite = null
    @property(cc.SpriteFrame)
    private bgArr:cc.SpriteFrame[] = []
    @property(cc.Node)
    private cashOutBtn:cc.Node = null;
    @property(cc.Node)
    private arrow:cc.Node = null
    @property(cc.Node)
    private finger: cc.Node = null;
    @property(cc.Label)
    private monlabel: cc.Label = null;
    @property(cc.Node)
    private resultNode:cc.Node = null;

    private clearId:number = null;
    private raduis: number = 50
    private allData: any = null
    private allNum:number = null;
    private TurnId:number = null;
    private turnTable:TurnTable = null;
    private monerChange: MoneyChange = null;
    private amount: number = 0
    private bgmAudioFlag:boolean = true
    private originPos:any = null
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart',()=>{
            this.bgmAudioFlag && cc.audioEngine.play(RESSpriteFrame.instance.BgmAudioClip,false,1)   
            this.bgmAudioFlag = false
        })
        this.resize()
        this.initScratch()
        this.initAnim()
        this.turnTable = this.table.getComponent(TurnTable)
        this.table.on(cc.Node.EventType.TOUCH_END,this.initView,this)
        this.scratchNode.active  = this.resultNode.active = false
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true,this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private initScratch(){
        this.scratSystem.active = false
        this.maskSprite.node.on(cc.Node.EventType.TOUCH_START, this.touchStartFunc, this)
        this.maskSprite.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoveFunc, this)
        this.maskSprite.node.on(cc.Node.EventType.TOUCH_END, this.touchEndFunc, this)
        let rows = Math.floor(this.maskSprite.node.height / (this.raduis * 2))
        let cols = Math.floor(this.maskSprite.node.width / (this.raduis * 2))
        this.allData = []
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                this.allData.push({ "x": j, "y": i })
            }
        }
        this.allNum = this.allData.length
    }
    private initAnim(){
        cc.tween(this.table).repeatForever(
            cc.tween()
            .delay(0.5)
            .to(2,{angle:60},{easing:'sineOut'})
            .to(2.5,{angle:0},{easing:'sineOut'})
            ).start()
    }
    private initView(){
        this.finger.active = this.arrow.active = false
        EffectUtils.removeTweens(this.table)
        cc.audioEngine.play(RESSpriteFrame.instance.StartAudioClip,false,1)
        this.table.off(cc.Node.EventType.TOUCH_END,this.initView,this)
        setTimeout(() => {
            this.TurnId = cc.audioEngine.play(RESSpriteFrame.instance.TurnAudioClip,true,1)
        }, 1000);
        this.turnTable.turnTo(6,()=>{
            cc.audioEngine.pause(this.TurnId)
            cc.audioEngine.play(RESSpriteFrame.instance.GetRewardAudioClip,false,1)
            Utils.showUI(this.scratchNode,RESSpriteFrame.instance.comeOutAudioClip,0.3,true,1.2,1,()=>{
            },0.3,0.3)
        })
    }
    private touchStartFunc(e){
        this.clearId = cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip,true,1)
        this.scratchFinger.getComponent(cc.Animation).stop('scratchfinger')
        this.scratchFinger.active = this.scratSystem.active = true
        let pos = e.getLocation()
        pos = this.scratchFinger.parent.convertToNodeSpaceAR(pos)
        this.scratchFinger.x = pos.x
        this.scratchFinger.y = pos.y
    }
    private touchMoveFunc(e){
        let pos = this.getPos(e)
        let delta = e.getDelta()
        this.scratchFinger.x +=delta.x
        this.scratchFinger.y += delta.y
        this.clearFunc(pos)
        this.reomveData(pos)
    }
    private touchEndFunc(){
        cc.audioEngine.pause(this.clearId)
        this.scratSystem.active = false
        let isFinish = this.allData.length / this.allNum < 0.4 ? true : false
        if(isFinish){
            this.maskNode.node.active = this.scratchFinger.active = false
            let pos = Utils.getLocalPositionWithOtherNode(this.node,this.monlabel.node)
            Anim.ins().ShowFlyAni(this.moneyPrefab,this.node,15,pos,()=>{
                Utils.showUI(this.resultNode,RESSpriteFrame.instance.comeOutAudioClip,0.3,true,1.2,1,()=>{
                    this.mask.active = true
                    cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                },0.28,0.3)
            },this)
            setTimeout(()=>{
                cc.audioEngine.play(RESSpriteFrame.instance.GetMoneyAudioClip,false,1)
                this.monerChange.play(LanguageManager.instance.formatUnit(300),0.5,()=>{

                },this)
            },800)
        }
    }
    private getPos(e){
        return this.maskSprite.node.convertToNodeSpaceAR(e.getLocation())
    }
    private clearFunc(pos){
        let graphics = this.maskNode._graphics
        graphics.circle(pos.x,pos.y,this.raduis)
        graphics.fill()
    }
    private reomveData(pos: any) {
        let x = Math.floor((pos.x + this.maskSprite.node.width / 2) / (this.raduis * 2))
        let y = Math.floor((pos.y + this.maskSprite.node.height / 2) / (this.raduis * 2))
        for (let i = 0; i < this.allData.length; i++) {
            if (this.allData[i].x == x && this.allData[i].y == y) {
                this.allData.splice(i, 1)
            }
        }
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.maxBg.active = !isVerTical
        // this.bg.spriteFrame = isVerTical ? this.bgArr[0] : null
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
        this.resultNode.scale = isVerTical ? 1 : 1.5
        this.tipLabel.node.active = isVerTical
        this.tipLabel1.node.active = !isVerTical
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.DownLoadAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
}   
