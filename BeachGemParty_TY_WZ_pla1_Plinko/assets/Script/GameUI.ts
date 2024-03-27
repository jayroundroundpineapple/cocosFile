import Ball from "./Ball";
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
    private kuangNode: cc.Node = null;
    @property(cc.Node)
    private BornBtn: cc.Node = null
    @property(cc.Prefab)
    private obstaclePre: cc.Prefab = null
    @property(cc.Node)
    private obstacleBox: cc.Node = null
    @property(cc.Prefab)
    private ballPrefab: cc.Prefab = null
    @property(cc.Node)
    private bornBox: cc.Node = null
    @property(cc.Label)
    private moneyLabel: cc.Label = null
    @property(cc.Node)
    private mask: cc.Node = null;
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Label)
    private tipLabel1: cc.Label = null;
    @property(cc.Node)
    private cashOutBtn: cc.Node = null;
    @property(cc.Node)
    private finger: cc.Node = null;
    @property(cc.Node)
    private resultNode: cc.Node = null;
    @property(cc.Node)
    private tipNode:cc.Node = null

    private allItem: any = []
    private AutoInBagNum: number = 0
    private ballPool: cc.NodePool = null
    private moneyChange: MoneyChange = null;
    private amount: number = 0
    private bgmAudioFlag: boolean = true
    private clickTime: number = 0
    private canShowFlag: boolean = true

    protected onLoad(): void {
        cc.director.getPhysicsManager().enabled = true
    }
    protected start(): void {
        PlayerAdSdk.init();
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            this.bgmAudioFlag && cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, true, 1)
            this.bgmAudioFlag = false
        })
        this.BornBtn.on(cc.Node.EventType.TOUCH_START, this.ClickBornFunc, this)
        this.ballPool = new cc.NodePool()
        this.initPool()
        this.resize()
        Utils.SetScale(this.BornBtn, 1.1, 1, 0.3, true)
        Utils.SetScale(this.finger, 1.65, 1.5, 0.3, true)
        this.tipNode.active = this.resultNode.active = false
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.moneyChange = new MoneyChange(this.moneyLabel, false, this.amount)
        this.moneyChange.prefix = unit
        this.moneyLabel.string = `${unit}${this.amount}`
        setTimeout(() => {
            this.BornBtn.off(cc.Node.EventType.TOUCH_START, this.ClickBornFunc, this)
            this.finger.active = this.tipNode.active =  false
            this.setGrey()
            EffectUtils.removeTweens(this.BornBtn)
            this.doAnim(() => {
                this.createBall(true)
            })
        }, 8000);
    }
    private initPool() {
        //生成障碍物
        for (let i = 0; i < 6; i++) {
            let number = i % 2 == 0 ? 6 : 5
            for (let j = 0; j < number; j++) {
                let obstacleItem = cc.instantiate(this.obstaclePre)
                obstacleItem.parent = this.obstacleBox
                obstacleItem.on('AddMoney', this.addMoneyFunc, this)
                if (i % 2 == 0) {
                    // obstacleItem.position = cc.v3(100 * j + 30, -100 * i, 0)
                    obstacleItem.x = 100 * j + 30
                    obstacleItem.y = -100 * i
                } else {
                    // obstacleItem.position = cc.v3(100 * j + 80, -100 * i, 0)
                    obstacleItem.x = 100 * j + 80
                    obstacleItem.y = -100 * i
                }
                if (this.allItem[i] == null) this.allItem[i] = []
                this.allItem[i][j] = obstacleItem
            }
        }
        for (let i = 0; i < 15; i++) {
            let ballItem = cc.instantiate(this.ballPrefab)
            this.ballPool.put(ballItem)
        }
    }
    private doAnim(callback: Function) {
        cc.audioEngine.play(RESSpriteFrame.instance.SlideAudioClip, false, 1)
        let item = null
        for (let i = 0; i < this.kuangNode.children.length; i++) {
            item = this.kuangNode.children[i]
            cc.tween(item)
                .to(1.8, { y: item.y - 750 }, { easing: 'quadInOut' })
                .call(() => {
                    setTimeout(() => {
                        callback()
                    }, this.getRandomInt(1, 200) * 10);
                })
                .start()
        }
    }
    private ClickBornFunc() {
        this.clickTime++
        if(this.clickTime == 1){
            this.tipNode.active = true
            Utils.SetScale(this.tipNode,1.5,1.6,0.25,true)
        }
        if (this.clickTime > 10){
            this.setGrey()
            this.tipNode.active = false
            this.BornBtn.off(cc.Node.EventType.TOUCH_START, this.ClickBornFunc, this)
        }
        this.finger.active = false
        EffectUtils.removeTweens(this.BornBtn)
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        Utils.SetScale(this.BornBtn, 1.1,1, 0.1, false, 1)
        this.createBall()
    }
    private setGrey(){
        var material = cc.Material.createWithBuiltin(cc.Material.BUILTIN_NAME.GRAY_SPRITE,0)
        this.BornBtn.getComponent(cc.Sprite).setMaterial(0,material)
        this.BornBtn.children[0].getComponent(cc.Label).setMaterial(0,material)
    }
    private createBall(isAtuo?: boolean) {
        let ballItem = null
        if (this.ballPool.size() > 0) {
            ballItem = this.ballPool.get()
        } else {
            ballItem = cc.instantiate(this.ballPrefab)
        }
        ballItem.getComponent(Ball).initItem()
        if (isAtuo) {
            ballItem.getComponent(cc.PhysicsCircleCollider).tag = 1
        }
        ballItem.on('ShootInBox', this.EnterBag, this)
        ballItem.x = this.getRandomInt(-300, 300)
        ballItem.y = this.getRandomInt(-100, -50)
        ballItem.parent = this.bornBox
    }
    private addMoneyFunc(num: number) {
        this.moneyChange.count = this.amount
        this.amount += num
        this.moneyChange.play(this.amount, .1, () => { }, this)
    }
    private EnterBag(num: number, isAtuo: boolean) {
        this.moneyChange.count = this.amount
        this.amount += num
        this.moneyChange.play(this.amount, .1, () => { }, this)
        if (isAtuo) {
            this.AutoInBagNum++
            if (this.AutoInBagNum >= this.kuangNode.children.length && this.canShowFlag) {
                this.canShowFlag = false
                this.mask.active = true
                Utils.showUI(this.resultNode, RESSpriteFrame.instance.comeOutAudioClip, 0.3, true, 1.1, 1, () => {
                    cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip, false, 1)
                })
            }
        }
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
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
        if (isVerTical) {
            for (let i = 0; i < 6; i++) {
                let number = i % 2 == 0 ? 6 : 5
                for (let j = 0; j < number; j++) {
                    if (i % 2 == 0) {
                        this.allItem[i][j].x = 100 * j + 30
                        this.allItem[i][j].y = -100 * i
                    } else {
                        this.allItem[i][j].x = 100 * j + 80
                        this.allItem[i][j].y = -100 * i
                    }
                }
            }
        } else {
            for (let i = 0; i < 6; i++) {
                let number = i % 2 == 0 ? 6 : 5
                for (let j = 0; j < number; j++) {
                    if (i % 2 == 0) {
                        this.allItem[i][j].x = 100 * j + 30 + 1
                        this.allItem[i][j].y = -100 * i
                    } else {
                        this.allItem[i][j].x = 100 * j + 80 + 1
                        this.allItem[i][j].y = -100 * i
                    }
                }
            }
        }
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    protected onDisable(): void {
    }
}   
