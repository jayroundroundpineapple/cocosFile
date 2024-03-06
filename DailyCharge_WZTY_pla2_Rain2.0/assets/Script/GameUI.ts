import CoinItem from "./CoinItem";
import { LanguageComponent } from "./language/LanguageComponent";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import MoneyChange from "./utils/MoneyChange";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private startBg:cc.Node = null;
    @property(cc.Sprite)
    private bg: cc.Sprite = null
    @property(cc.SpriteFrame)
    private bgArr: cc.SpriteFrame[] = []
    @property(cc.Node)
    private topBg: cc.Node = null;
    @property(cc.SpriteFrame)
    private countArr: cc.SpriteFrame[] = []
    @property(cc.Sprite)
    private countSprite: cc.Sprite = null
    @property(cc.Node)
    private maskNode: cc.Node = null;
    @property(cc.Prefab)
    private redPrefab: cc.Prefab = null
    @property(cc.Label)
    private coinlabel: cc.Label = null
    @property(cc.Node)
    private redItemLayer: cc.Node = null;
    @property(cc.Node)
    private finger: cc.Node = null;
    @property(cc.Node)
    private resultNode: cc.Node = null;
    @property(cc.Node)
    private cashoutBtn: cc.Node = null;
    @property(cc.Label)
    private resultLabel:cc.Label = null;
    
    private totalNum: number = 10;
    private moneyChange: MoneyChange = null
    private redItemPool: cc.NodePool;
    private flag: boolean = false
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        this.resize()
        this.resultNode.on(cc.Node.EventType.TOUCH_START,this.cashoutFunc,this)
        this.totalNum = LanguageManager.instance.formatUnit(this.totalNum)
        this.moneyChange = new MoneyChange(this.coinlabel, false,this.totalNum)
        let unit = LanguageManager.instance.getText(10001)
        this.moneyChange.prefix = unit
        this.coinlabel.string = `${unit}${this.totalNum}`
        this.redItemPool = new cc.NodePool()
        //对象池初始值
        let initCount = 10
        for (let i = 0; i < initCount; i++) {
            let redItem = cc.instantiate(this.redPrefab)
            this.redItemPool.put(redItem)
        }
        this.resultNode.active = false
        this.topBg.active = false
        this.finger.active = true
        this.finger.on(cc.Node.EventType.TOUCH_START, this.startCount, this)
        this.cashoutBtn.on(cc.Node.EventType.TOUCH_START, this.cashoutFunc, this)
    }
    private startCount() {
        if (!this.flag) {
            cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
            cc.audioEngine.play(RESSpriteFrame.instance.countTimeAudioClip, false, 1)
            this.countSprite.spriteFrame = this.countArr[2]
            this.flag = !this.flag
            this.finger.active = false
            this.startBg.active = false
            let time = 3
            let countTime = async () => {
                time -= 1
                if (time > 0) {
                    this.countSprite.spriteFrame = this.countArr[time - 1]

                } else {
                    this.unschedule(countTime)
                    this.startGame()
                }
            }
            this.schedule(countTime, 1)
        }
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private startGame() {
        this.topBg.active = true
        this.maskNode.opacity = 180
        this.countSprite.node.active = false
        let time = 5
        let countDown = async () => {
            time -= 1
            if (time > 0) {

            } else {
                this.unschedule(this.createRedItem)
                this.unschedule(countDown)
                setTimeout(() => {
                    cc.audioEngine.play(RESSpriteFrame.instance.comeOutAudioClip, false, 1)
                    cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip, false, 1)
                    let unit = LanguageManager.instance.getText(10001)
                    this.resultLabel.string = `${unit}${this.totalNum}`
                    this.resultNode.active = true
                })
            }
        }
        this.schedule(this.createRedItem, 0.3)
        this.schedule(countDown, 1)
    }
    private createRedItem() {
        let redItem = null
        if (this.redItemPool.size() > 0) {
            redItem = this.redItemPool.get()
        } else {
            redItem = cc.instantiate(this.redPrefab)
        }
        redItem.getComponent(CoinItem).game = this
        redItem.getComponent(CoinItem).initItem()
        redItem.active = true
        redItem.parent = this.redItemLayer
        redItem.x = this.getRandomInt(-cc.winSize.width / 2 + redItem.width / 2, cc.winSize.width / 2 - redItem.width / 2)
        let randomS = 0.1 * this.getRandomInt(10,20)
        redItem.getComponent(CoinItem).setTail(randomS)
        setTimeout(() => {
            redItem.getComponent(CoinItem).setSteak(false)
        }, randomS * 1000);
        cc.tween(redItem)
            .to(randomS, { position: cc.v2(redItem.x, (- cc.winSize.height + redItem.height) / 2)})
            .to(randomS,{ position: cc.v2(redItem.x, (- cc.winSize.height + redItem.height)),opacity:0})
            .call(() => {
                redItem.active = false
                this.redItemPool.put(redItem)
            }).start()
       
    }
    private addScore() {
        let id = cc.audioEngine.play(RESSpriteFrame.instance.numberAddAudioClip, false, 1)
        let num = LanguageManager.instance.formatUnit(10)
        this.totalNum += num
        this.moneyChange.play(this.totalNum, 0.5, () => {
            cc.audioEngine.pause(id)
        })
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.bg.spriteFrame = isVerTical ? this.bgArr[0] : this.bgArr[1]
        if (isVerTical) {//竖屏
            this.startBg.scale = 1
            this.resultNode.scale = 1
            if (cc.winSize.width / cc.winSize.height > 0.7) {
                cc.Canvas.instance.fitHeight = true;
                cc.Canvas.instance.fitWidth = false;
            } else {
                cc.Canvas.instance.fitHeight = false;
                cc.Canvas.instance.fitWidth = true;
            }
        } else {
            this.startBg.scale = 1.5
            this.resultNode.scale = 1.5
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = false;
        }
        cc.director.getScene().getComponentsInChildren(cc.Widget).forEach(function (t) {
            t.updateAlignment()
        });
    }
    private cashoutFunc() {
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    protected onDisable(): void {
        this.finger.off(cc.Node.EventType.TOUCH_START, this.startCount, this)
        this.cashoutBtn.off(cc.Node.EventType.TOUCH_START, this.cashoutFunc, this)
    }
}   
