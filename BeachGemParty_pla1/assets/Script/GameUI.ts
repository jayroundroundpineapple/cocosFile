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
    private pigNode: cc.Node = null
    @property(cc.Node)
    private moneyBottom: cc.Node = null
    @property(cc.Node)
    private moneyBototm1: cc.Node = null;
    @property(cc.Node)
    private cardNode: cc.Node = null;
    @property(cc.SpriteFrame)
    private bgArr: cc.SpriteFrame[] = []
    @property(cc.Sprite)
    private bgSprite: cc.Sprite = null;
    @property(cc.Node)
    private cashOutBtn: cc.Node = null;
    //开始弹窗
    @property(cc.Node)
    private startBoxNode: cc.Node = null;
    @property(cc.Node)
    private verChessBox: cc.Node = null;
    @property(cc.Node)
    private horChessBox: cc.Node = null;
    @property(cc.Node)
    private startBtnNode: cc.Node = null
    @property(cc.Node)
    private startNode: cc.Node = null
    @property(cc.Node)
    private maskNode: cc.Node = null
    @property(cc.Node)
    private chessBox: cc.Node = null;
    @property(cc.Node)
    private rightTopNode: cc.Node = null
    @property(cc.Node)
    private bornArr: cc.Node[] = []
    @property(cc.Node)
    private clearNode: cc.Node = null;
    @property(cc.Node)
    private clearSystem: cc.Node = null;
    @property(cc.Node)
    private firstSystem: cc.Node = null;
    @property(cc.Node)
    private secondSystem: cc.Node = null;
    @property(cc.Node)
    private targetNode1: cc.Node = null
    @property(cc.ProgressBar)
    private progress: cc.ProgressBar = null
    @property(cc.Label)
    private barLabel: cc.Label = null;
    @property(cc.Node)
    private tipArrow: cc.Node = null;
    @property(cc.Node)
    private targetNode: cc.Node = null
    @property(cc.Node)
    private targetNodeTop: cc.Node = null;
    @property(cc.Node)
    private firstArr: cc.Node[] = [];
    @property(cc.Node)
    private secordArr: cc.Node[] = [];
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Label)
    private tipLabel1: cc.Label = null;
    @property(cc.Prefab)
    private moneyPrefab: cc.Prefab = null
    @property(cc.Label)
    private moneyLabel: cc.Label = null;
    @property(cc.Node)
    private bottomNode: cc.Node = null;
    @property(cc.Node)
    private kuangAnim: cc.Node = null;
    //结束弹窗
    @property(cc.Node)
    private light: cc.Node = null;
    @property(cc.Node)
    private resultNode: cc.Node = null;
    @property(cc.Node)
    private boxSpine: cc.Node = null;
    @property(cc.Node)
    private coinSystem: cc.Node = null;
    @property(cc.Node)
    private resultTitle: cc.Node = null;
    @property(cc.Label)
    private resultlabel: cc.Label = null;

    private amount: number = 300.00
    private bgmAudioFlag: boolean = false
    /**半径阈值 */
    private raudis: number = 105
    private originPos: cc.Vec2 = cc.v2(44.7, -74.3)
    private firstFinshed: boolean = false
    private secondFinshed: boolean = false
    private moneyChange: MoneyChange = null;
    private canProgress: boolean = false
    private barNum: number = 0
    private isStart: boolean = false
    private userClicked: boolean = false

    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            !this.bgmAudioFlag && cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, false, 1)
            this.bgmAudioFlag = true
        })
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.verChessBox.active = isVerTical
        this.horChessBox.active = !isVerTical
        this.chessBox.active = this.resultNode.active = this.kuangAnim.active = this.light.active = false
        this.startNode.active = true
        this.startNode.on(cc.Node.EventType.TOUCH_START, this.startGame, this)
        this.moneyChange = new MoneyChange(this.moneyLabel, false)
        let unit = LanguageManager.instance.getText(10001)
        this.moneyChange.prefix = unit
        let num = LanguageManager.instance.formatUnit(500)
        this.resultlabel.string = `${unit}${num}`
        this.moneyLabel.string = `${unit}0`
        this.targetNode.on(cc.Node.EventType.TOUCH_START, this.onMouserHandler, this)
        this.resize()
        this.amount = LanguageManager.instance.formatUnit(this.amount)
    }
    private startGame() {
        this.isStart = true
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        this.maskNode.active = this.startNode.active = this.startBtnNode.active = this.verChessBox.active = this.horChessBox.active = this.startBoxNode.active = false
        this.chessBox.active = true
    }
    private onMouserHandler() {
        this.tipArrow.active = false
        this.targetNode.scale = 1.2
        this.targetNode.on(cc.Node.EventType.TOUCH_END, this.TouchEndHandler, this)
        this.targetNode.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEndHandler, this)
        this.targetNode.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMoveHandler, this)
    }
    private TouchEndHandler(evt: cc.Event.EventTouch) {
        let node = evt.target
        let touchPos = evt.getLocation()
        const startPos: cc.Vec2 = evt.getStartLocation()
        console.log('EndsatrtPos,endtouchPos离开触发', startPos, touchPos)
        let offset = touchPos.sub(startPos)
        let distanceX: number = Math.abs(offset.x)
        let distanceY: number = Math.abs(offset.y)
        console.log('DisXY', offset.x, offset.y);
        if (Math.abs(offset.x) < (this.targetNode.width / 3) && offset.y > (this.targetNode.height / 3)) {//成功移动
            let targetTopPos = this.targetNode1.parent.convertToWorldSpaceAR(this.targetNode1.position)
            targetTopPos = this.targetNode.parent.convertToNodeSpaceAR(targetTopPos)
            cc.tween(this.targetNode).delay(0.05)
                .to(0.3, { position: targetTopPos }, { easing: 'quadOut' })
                .start()
            cc.tween(this.targetNode1).delay(0.07)
                .to(0.3, { y: this.originPos.y }, { easing: 'quadOut' })
                .call(() => {
                    this.closeListenEvent()
                    setTimeout(() => {
                        let pos = Utils.getLocalPositionWithOtherNode(this.node, this.moneyLabel.node)
                        Anim.ins().ShowFlyAni(this.moneyPrefab, this.node, 10, pos, () => {
                            EffectUtils.removeTweens(this.moneyLabel.node)
                        })
                        let id = cc.audioEngine.play(RESSpriteFrame.instance.numberAddAudioClip, false, 2)
                        let num = LanguageManager.instance.formatUnit(200)
                        this.moneyChange.play(num, 0.5, () => {
                            cc.audioEngine.pause(id)
                            this.canProgress = false
                        })
                        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
                        this.canProgress = true
                        this.clearSystem.active = true
                        this.kuangAnim.active = true
                        for (let i = 0; i < this.clearNode.children.length; i++) {
                            this.clearNode.children[i].destroy()
                        }
                        this.bornFunc()  //下落
                    }, 100);
                })
                .start()
            console.log('交换完毕');
        } else {
            cc.tween(this.targetNode).delay(0.05)
                .to(0.3, { x: this.originPos.x, y: this.originPos.y }, { easing: 'quadOut' })
                .start()
            console.log('归位');
        }
    }
    private bornFunc() {
        let Pos = new cc.Vec3()
        Pos.y = this.bottomNode.y + 105 * 4
        cc.tween(this.rightTopNode)
            .to(0.2, { y: this.rightTopNode.y - 105 })
            .start()
        for (let i = 0; i < this.bornArr.length; i++) {
            if (i == 0) {
                Pos.x = -58
                Pos = this.bottomNode.parent.convertToWorldSpaceAR(Pos)
                Pos = this.bornArr[i].children[0].convertToNodeSpaceAR(Pos)
                cc.tween(this.bornArr[i].children[0])
                    .to(0.3, { position: Pos }, { easing: 'quadOut' })
                    .start()
            }
            if (i == 1) {
                for (let j = 0; j < this.bornArr[i].children.length; j++) {
                    let Pos1 = new cc.Vec3(51, this.bottomNode.y + 105 * (j + 3), 0)
                    let targetPos = this.bottomNode.parent.convertToWorldSpaceAR(Pos1)
                    targetPos = this.bornArr[i].children[j].parent.convertToNodeSpaceAR(targetPos)
                    cc.tween(this.bornArr[i].children[j])
                        .to(0.3, { position: targetPos }, { easing: 'quadOut' })
                        .start()
                }
            }
            if (i == 2) {
                for (let j = 0; j < this.bornArr[i].children.length; j++) {
                    let Pos2 = new cc.Vec2(this.originPos.x, this.originPos.y + 105 * j)
                    let targetPos = this.targetNode.parent.convertToWorldSpaceAR(Pos2)
                    targetPos = this.bornArr[i].children[j].parent.convertToNodeSpaceAR(targetPos)
                    cc.tween(this.bornArr[i].children[j])
                        .to(0.3, { y: targetPos.y }, { easing: 'quadOut' })
                        .call(() => {
                            setTimeout(() => {
                                if (j == 1 && !this.firstFinshed) {
                                    for (let i = 0; i < this.firstArr.length; i++) {
                                        this.firstArr[i].active = false
                                    }
                                    let pos = Utils.getLocalPositionWithOtherNode(this.node, this.moneyLabel.node)
                                    Anim.ins().ShowFlyAni(this.moneyPrefab, this.node, 15, pos, () => {
                                        EffectUtils.removeTweens(this.moneyLabel.node)
                                    })
                                    let num = LanguageManager.instance.formatUnit(350)
                                    this.canProgress = true
                                    this.moneyChange.play(num, 0.6, () => {
                                        this.canProgress = false
                                    })
                                    cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
                                    this.firstSystem.active = true
                                    this.firstFinshed = true
                                    this.clearSecondFunc()
                                }
                            }, 300)
                        })
                        .start()
                }
            }
            if (i == 3) {
                for (let j = 0; j < this.bornArr[i].children.length; j++) {
                    let Pos3 = new cc.Vec2(this.rightTopNode.x, this.bottomNode.y + 105 * (j + 4))
                    let targetPos = this.bottomNode.parent.convertToWorldSpaceAR(Pos3)
                    targetPos = this.bornArr[i].children[j].parent.convertToNodeSpaceAR(targetPos)
                    cc.tween(this.bornArr[i].children[j])
                        .to(0.3, { y: targetPos.y }, { easing: 'quadOut' })
                        .start()
                }
            }
        }
    }
    private clearSecondFunc() {
        setTimeout(() => {
            this.originPos.y = this.originPos.y - 105 * 3
            let length = this.bornArr[2].children.length
            let Pos = new cc.Vec3()
            Pos.x = 152
            for (let i = 2; i < length; i++) {
                // let Pos = new cc.Vec2(this.originPos.x, this.originPos.y + 105 * (i-2))
                Pos.y = this.bottomNode.y + 105 * (i - 1)
                let targetPos = this.bottomNode.parent.convertToWorldSpaceAR(Pos)
                targetPos = this.bornArr[2].children[i].parent.convertToNodeSpaceAR(targetPos)
                cc.tween(this.bornArr[2].children[i])
                    .delay(0.2)
                    .to(0.4, { position: targetPos }, { easing: 'quadOut' })
                    .call(() => {
                        if (i == 3) {
                            this.secordArr.forEach((item, index) => {
                                item.active = false
                            })
                            let pos = Utils.getLocalPositionWithOtherNode(this.node, this.moneyLabel.node)
                            Anim.ins().ShowFlyAni(this.moneyPrefab, this.node, 10, pos, () => {
                                EffectUtils.removeTweens(this.moneyLabel.node)
                            })
                            let num = LanguageManager.instance.formatUnit(500)
                            this.canProgress = true
                            let isVerTical = cc.winSize.height > cc.winSize.width ? true : false
                            let StartScale = isVerTical ? 1.1 : 1.4
                            let endScale = isVerTical ? 1 : 1.3
                            this.moneyChange.play(num, 1, () => {
                                this.canProgress = false
                                this.maskNode.active = true
                                Utils.showUI(this.resultNode, RESSpriteFrame.instance.cherrUpAudioClip,0.2,this.bgmAudioFlag,StartScale,endScale,() => {
                                    const BoxSkeleton = this.boxSpine.getComponent(sp.Skeleton)
                                    this.boxSpine.active = true
                                    this.resultTitle.active = true
                                    this.light.active = true
                                    // BoxSkeleton.setAnimation(0, 'idle', false)
                                    // BoxSkeleton.setAnimation(0, 'openidle', false)
                                    BoxSkeleton.setAnimation(0, 'run', false)
                                    setTimeout(() => {
                                        cc.audioEngine.play(RESSpriteFrame.instance.winAudioClip, false, 1)
                                        this.coinSystem.active = true
                                    }, 2500)
                                    setTimeout(() => {
                                        this.cashOutBtn.active = this.resultlabel.node.active = true
                                    }, 2500)
                                },0.25,0.2)
                            })
                            cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip, false, 1)
                            this.secondSystem.active = true
                        }
                    })
                    .start()
            }
            this.clearThird()
        }, 300)
    }
    private clearThird() {
        setTimeout(() => {
            this.originPos.y = this.originPos.y - 105 * 3
            let length = this.bornArr[2].children.length
            let Pos = new cc.Vec3()
            Pos.x = 152
            for (let i = 4; i < length; i++) {
                // let Pos = new cc.Vec2(this.originPos.x, this.originPos.y + 105 * (i-2))
                Pos.y = this.bottomNode.y + 105 * (i - 4)
                let targetPos = this.bottomNode.parent.convertToWorldSpaceAR(Pos)
                targetPos = this.bornArr[2].children[i].parent.convertToNodeSpaceAR(targetPos)
                this.canProgress = false
                cc.tween(this.bornArr[2].children[i])
                    .delay(0.2)
                    .to(0.4, { position: targetPos }, { easing: 'quadOut' })
                    .start()
            }
        }, 500);
    }
    private TouchMoveHandler(evt: cc.Event.EventTouch) {
        this.targetNode.zIndex = 99
        let node = evt.target
        let touchPos = node.convertToNodeSpaceAR(evt.getLocation())
        const startPos = node.convertToNodeSpaceAR(evt.getStartLocation())
        let offset = touchPos.sub(startPos)
        if (offset.mag() > this.raudis) {
            let normal = offset.normalizeSelf()  //向量长度归1，不超出阈值范围
            this.targetNode.x = normal.x * this.raudis + this.originPos.x
            this.targetNode.y = normal.y * this.raudis + this.originPos.y
        } else {  //正常移动
            let x = this.originPos.x + offset.x
            let y = this.originPos.y + offset.y
            this.targetNode.x = x
            this.targetNode.y = y
        }
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.tipLabel.node.active = this.moneyBottom.active = isVerTical
        this.tipLabel1.node.active = this.moneyBototm1.active = !isVerTical
        this.bgSprite.spriteFrame = isVerTical ? this.bgArr[0] : this.bgArr[1]
        if (!this.isStart) {
            this.horChessBox.active = !isVerTical
            this.verChessBox.active = isVerTical
        }
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
        this.chessBox.getComponent(cc.Widget).left = isVerTical ? 34.44 : cc.winSize.width / 15
        this.chessBox.getComponent(cc.Widget).bottom = isVerTical ? 267.5 : cc.winSize.height / 8
        this.chessBox.scale = isVerTical ? 1 : 1.5
        this.cardNode.scale = isVerTical ? 1 : 1.5
        this.moneyBottom.scale = this.moneyBototm1.scale = isVerTical ? 1 : 1.95
        this.startNode.scale = isVerTical ? 1 : 1.5
        this.startBoxNode.scale = isVerTical ? 1 : 1.5
        this.pigNode.scale = isVerTical ? 1 : 1.5
        this.pigNode.getComponent(cc.Widget).bottom = isVerTical ? 563.6 : 10
    }
    private cashoutFunc() {
        console.log('跳转');
        this.userClicked = true
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    private closeListenEvent() {
        this.targetNode.off(cc.Node.EventType.TOUCH_START, this.onMouserHandler, this)
        this.targetNode.off(cc.Node.EventType.TOUCH_END, this.TouchEndHandler, this)
        this.targetNode.off(cc.Node.EventType.TOUCH_CANCEL, this.TouchEndHandler, this)
        this.targetNode.off(cc.Node.EventType.TOUCH_MOVE, this.TouchMoveHandler, this)
    }
    protected update(dt: number): void {
        if (this.canProgress) {
            if (this.barNum > 201) return;
            if (this.barNum > 200) this.barNum--
            this.barLabel.string = `${this.barNum}/200`
            this.progress.progress = this.barNum / 200
            this.barNum += 2
        }
    }
}   
