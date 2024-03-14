import { BoxManager } from "./box/BoxManager";
import Item from "./Item";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;
const enum ItemType {
    pink = 1,
    yellow = 2,
    red = 3,
    blue = 4
}

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private bottomBg:cc.Node = null;
    @property(cc.Prefab)
    private moneyPre: cc.Prefab = null;
    @property(cc.Node)
    private coinNode: cc.Node = null
    @property(cc.Node)
    private topCard: cc.Node = null;
    @property(cc.Node)
    private hornPig: cc.Node = null;
    @property(cc.ProgressBar)
    private pigProgressBar: cc.ProgressBar = null;
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
    @property(cc.Node)
    private resultNode: cc.Node = null;
    @property(cc.Prefab)
    private BoxPrefab: cc.Prefab = null;
    @property(cc.Node)
    private chessBox: cc.Node = null;
    @property(cc.Node)
    private contentNode: cc.Node = null;
    @property(cc.Node)
    private bottomNode: cc.Node = null;

    private proFlag:boolean = false
    private proNum:number = 0
    private moveUnitY: number = 69  //向下移动单位
    private allItemArr: any = {}
    private gameColmun: number = 9
    private gameRow: number = 8
    private totalArr: Item[] = []
    private _data: any = null;
    private monerChange: MoneyChange = null;
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
            this.bgmAudioFlag && cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, false, 1)
            this.bgmAudioFlag = false
        })
        this.initBlock()
        this.resultNode.active = false
        this.finger.active = true
        Utils.SetScale(this.finger, 1.1, 0.4)
        this.resize()
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true, this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
    }
    private clickFunc() {
        this.finger.active = false
        this.proFlag = true
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        Anim.ins().shakeEffect(this.bg.node, 0.3)
        let num = LanguageManager.instance.formatUnit(200)
        this.chessBox.off(cc.Node.EventType.TOUCH_START, this.clickFunc, this)
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
        for (let i = 0; i < this.gameRow; i++) {
            for (let j = 0; j < this.gameColmun; j++) {
                if (this.allItemArr[i][j].spriteIndex == ItemType.yellow) {
                    this.allItemArr[i][j].setClear(i * 0.15)
                    this.allItemArr[i][j].isEmpty = true
                }
            }
        }
        let pos = Utils.getLocalPositionWithOtherNode(this.contentNode, this.monlabel.node)
        Anim.ins().ShowFlyAni(this.moneyPre, this.contentNode, 15, pos, () => {
            this.proFlag = false
        }, this)
        setTimeout(() => {
            this.monerChange.play(num, 1, () => {
                this.initSecond()
                this.finger.x = -210
                this.finger.active = true
                this.chessBox.on(cc.Node.EventType.TOUCH_START, this.clickSecondFunc, this)
            })
        }, 600);
        this.scheduleOnce(this.fallDown, .9)
    }
    private initSecond() {
        for (let i = 0; i < this.gameRow; i++) {
            for (let j = 0; j < this.gameColmun; j++) {
                if (this.allItemArr[i][j].spriteIndex == ItemType.pink) {
                    this.allItemArr[i][j].setLight()
                }
            }
        }
    }
    private clickSecondFunc() {
        this.chessBox.off(cc.Node.EventType.TOUCH_START, this.clickSecondFunc, this)
        this.finger.active = false
        this.proFlag = true
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        Anim.ins().shakeEffect(this.bg.node, 0.3)
        let num = LanguageManager.instance.formatUnit(500)
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
        for (let i = 0; i < this.gameRow; i++) {
            for (let j = 0; j < this.gameColmun; j++) {
                if (this.allItemArr[i][j].spriteIndex == ItemType.pink) {
                    this.allItemArr[i][j].setClear(i * 0.15)
                    this.allItemArr[i][j].isEmpty = true
                }
            }
        }
        let pos = Utils.getLocalPositionWithOtherNode(this.contentNode, this.monlabel.node)
        let isVerTical = cc.winSize.height > cc.winSize.width
        let startScale = isVerTical ? 1.15 : 1.4
        let endScale = isVerTical ? 1 : 1.25
        Anim.ins().ShowFlyAni(this.moneyPre, this.contentNode, 15, pos, () => {
        }, this)
        setTimeout(() => {
            this.monerChange.play(num, 1, () => {
                Utils.showUI(this.resultNode,RESSpriteFrame.instance.comeOutAudioClip,0.3,true,startScale,endScale,()=>{
                    cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                },0.23,0.2)
            })
        }, 600);
    }
    private fallDown() {
        cc.tween(this.allItemArr[0][2].node)
            .to(.6, { y: this.allItemArr[0][2].node.y - 7 * this.moveUnitY }, { easing: 'quadInOut' })
            .start()
        cc.tween(this.allItemArr[0][6].node)
            .to(.6, { y: this.allItemArr[0][6].node.y - 7 * this.moveUnitY }, { easing: 'quadInOut' })
            .start()
        cc.tween(this.allItemArr[0][4].node)
            .to(.6, { y: this.allItemArr[0][4].node.y - 1 * this.moveUnitY }, { easing: 'quadInOut' })
            .start()
    }
    private initBlock() {
        this._data = BoxManager.instance.getData()
        let loadCounter = 0
        for (let i = 0; i < Object.keys(this._data).length; i++) {
            let itemPre = cc.instantiate(this.BoxPrefab)
            let item = itemPre.getComponent(Item)
            item.initItem(i, this._data[i].spriteIndex, cc.v2(this._data[i].posX, this._data[i].posY), this._data[i].isEmpty, () => {
                this.totalArr.push(item)
                loadCounter++
                if (loadCounter == Object.keys(this._data).length) {
                    this.totalArr.sort((a, b) => a.idNum - b.idNum)
                    this.initData()
                }
            })
            item.node.parent = this.chessBox
        }
        this.chessBox.on(cc.Node.EventType.TOUCH_START, this.clickFunc, this)
    }
    private initData() {
        let index = 0
        for (let i = 0; i < this.gameRow; i++) {
            for (let j = 0; j < this.gameColmun; j++) {
                if (!this.allItemArr[i]) {
                    this.allItemArr[i] = {}
                }
                this.allItemArr[i][j] = this.totalArr[index++]
            }
        }
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.bg.spriteFrame = isVerTical ? this.bgArr[0] : this.bgArr[1]
        this.coinNode.active = !isVerTical
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
        this.resultNode.scale = isVerTical ? 1 : 1.25
        this.bottomBg.active = isVerTical
        this.bottomNode.getComponent(cc.Widget).bottom = cc.winSize.height > 1300 ? cc.winSize.height / 20 : 5
        this.topCard.scale = isVerTical ? 1 : 1.5
        this.topCard.getComponent(cc.Widget).left = isVerTical ? 16 : cc.winSize.width / 15
        this.bottomNode.active = isVerTical
        this.resultNode.scale = isVerTical ? 1 : 1.2
        this.contentNode.scale = isVerTical ? 1 : 1.5
        this.hornPig.scale = isVerTical ? 1 : 1.65
        this.hornPig.getComponent(cc.Widget).top = isVerTical ? 279 : cc.winSize.height / 3
        this.contentNode.getComponent(cc.Widget).left = isVerTical ? 4.5 : cc.winSize.width / 15
        this.contentNode.y = isVerTical ? -210 :  -150
        this.tipLabel.node.active = isVerTical
        this.tipLabel1.node.active = !isVerTical
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    protected update(dt: number): void {
        if(this.proFlag){
            this.pigProgressBar.progress = this.proNum++ / 190
            if(this.proNum>190){
                this.proFlag = false
            }
        }
    }
}   
