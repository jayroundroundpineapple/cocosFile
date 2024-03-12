import { BoxManager } from "./box/BoxManager";
import Item from "./Item";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;
const enum ItemType {
    yellow = 1,
    blue = 0
}

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private coinNode:cc.Node = null
    @property(cc.Node)
    private topCard:cc.Node = null;
    @property(cc.SpriteFrame)
    private boxSprite:cc.SpriteFrame = null
    @property(cc.Node)
    private hornPig:cc.Node = null;
    @property(cc.Node)
    private pigNode: cc.Node = null;
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
    private bottomNode:cc.Node = null;

    private barNum: number = 0
    private ProbarFlag: boolean = false
    private moveUnit: number = 93  //移动单位
    private allItemArr: any = {}
    private gameColmun: number = 7
    private gameRow: number = 7
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
         this.resultNode.active = this.hornPig.active = false
        this.resize()
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true, this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
    }
    private clickFunc() {
        this.finger.active = false
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        cc.audioEngine.play(RESSpriteFrame.instance.vibrateAudioClip,false,3)
        Anim.ins().shakeEffect(this.bg.node, 0.3)
        let num = LanguageManager.instance.formatUnit(100)
        this.monerChange.play(num, 0.08, () => {
        })
        this.chessBox.off(cc.Node.EventType.TOUCH_START, this.clickFunc, this)
        this.ProbarFlag = true
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
        for (let i = 0; i < this.totalArr.length; i++) {
            if (this.totalArr[i].spriteIndex == ItemType.yellow) {
                this.totalArr[i].setClear()
                this.totalArr[i].isEmpty = true
            }
        }
        setTimeout(() => {
            this.ProbarFlag = false
            //计算下落
            let moveDis: number = 0
            let colMunClearNum: number = 0
            for (let j = 0; j < this.gameColmun; j++) {
                moveDis = 0
                colMunClearNum = 0
                for (let i = this.gameRow - 1; i >= 0; i--) {
                    if (this.allItemArr[i][j].isEmpty) {
                        colMunClearNum++
                        moveDis = this.moveUnit * colMunClearNum
                    }
                    if (moveDis != 0) {
                        cc.tween(this.allItemArr[i][j].node)
                            .to(.8, { y: this.allItemArr[i][j].node.y - moveDis })
                            .start()
                    }
                }
            }
            setTimeout(() => {
                let num = LanguageManager.instance.formatUnit(300)
                this.monerChange.play(num, 0.08, () => {
                })
                cc.audioEngine.play(RESSpriteFrame.instance.vibrateAudioClip,false,3)
                Anim.ins().shakeEffect(this.bg.node, 0.3)
                this.ProbarFlag = true
                cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
                for (let i = 0; i < this.totalArr.length; i++) {
                    if (this.totalArr[i].spriteIndex == ItemType.blue) {
                        this.totalArr[i].setClear()
                        this.totalArr[i].isEmpty = true
                    }
                }
            }, 800);
        }, 500);
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
        this.hornPig.active = Boolean(!isVerTical)
        this.bg.spriteFrame = isVerTical ? this.bgArr[0] : this.bgArr[1]
        this.coinNode.active = !isVerTical
        this.contentNode.getComponent(cc.Sprite).spriteFrame = isVerTical ? null : this.boxSprite
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
        this.bottomNode.getComponent(cc.Widget).bottom = cc.winSize.height > 1300 ? cc.winSize.height / 20 : 5 
        this.topCard.scale = isVerTical ? 1 : 1.5
        this.topCard.getComponent(cc.Widget).left = isVerTical ? 16 : cc.winSize.width / 15
        this.pigNode.scale = isVerTical ? 1 : 1.8
        this.pigNode.y = isVerTical ? 276 : 0
        this.bottomNode.active = isVerTical
        this.resultNode.scale = isVerTical ? 1 : 1.2
        this.contentNode.scale = isVerTical ? 1 : 1.5
        this.contentNode.getComponent(cc.Widget).left = isVerTical ? 4.5 : cc.winSize.width / 2
        this.contentNode.y = isVerTical ? -195: 0
        this.tipLabel.node.active = isVerTical
        this.tipLabel1.node.active = !isVerTical
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    private showPigAnim() {
        let scale = cc.winSize.height > cc.winSize.width ? 1.8 : 2.5
        let index = cc.winSize.height > cc.winSize.width ? 1 : 0
        let targetPos = this.contentNode.parent.convertToWorldSpaceAR(cc.v3(this.bg.node.x, this.bg.node.y, 0))
        targetPos = this.pigNode.parent.convertToNodeSpaceAR(targetPos)
        let isVerTical = cc.winSize.height > cc.winSize.width ? true : false
        let startScale = isVerTical ? 1.2 : 1.4
        let endScale = isVerTical ? 1 : 1.25
        cc.tween(this.pigNode).delay(0.2)
            .to(1.3, { position: targetPos, scale: scale }, { easing: 'quadInOut' })
            .call(() => {
                this.pigProgressBar.node.active = false
                cc.audioEngine.play(RESSpriteFrame.instance.boomAudioClip,false,1)
                const pigAnim = this.pigNode.getComponent(cc.Animation)
                let cilps = pigAnim.getClips()
                pigAnim.play(cilps[index].name)
                pigAnim.on('finished', () => {
                    this.pigNode.active = false
                    this.mask.active = true
                    Utils.showUI(this.resultNode, RESSpriteFrame.instance.comeOutAudioClip, 0.3, true, startScale, endScale, () => {
                        cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                    })
                })
            })
            .start()
    }
    protected update(dt: number): void {
        if (this.ProbarFlag) {
            if (this.barNum >= 80) {
                this.ProbarFlag = false
                this.showPigAnim()
                return
            }
            this.pigProgressBar.progress = this.barNum++ / 80
        }
    }
}   
