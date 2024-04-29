import Ball from "./Ball";
import RESSpriteFrame from "./RESSpriteFrame";


const { ccclass, property } = cc._decorator;

const TopY = 650 //小球到试管顶部Y值
const BottomY = -390 //小球试管顶部Y值
const BallGap = 170 //小球间隔距离
const CubeGap = 200 //试管间隔距离
const Ball_Max = 5 //试管最大容量小球个数
export const enum ItemType {
    pink = 1,
    red = 2,
    blue = 3,
    purple = 4,
    yellow = 5
}
export class CubeItem {
    public type: ItemType;
}
@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private tubeArr: cc.Node[] = []
    @property(cc.Prefab)
    private ballPre: cc.Prefab = null
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
    private cashOutBtn: cc.Node = null;
    @property(cc.Node)
    private finger: cc.Node = null;
    @property(cc.Label)
    private monlabel: cc.Label = null;
    @property(cc.Node)
    private resultNode: cc.Node = null;

    private IsBallUp: boolean = false  //小球是否已升起
    private totalArr: { [cubeId: number]: Ball[] } = {}
    private cubeFlagArr: { [cubeId: number]: boolean } = {}   //试管开关阀
    private randomMap: any = null
    private randomArr: any = null
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
        this.resize()
        this.resultNode.active = false
        this.cashOutBtn.on(cc.Node.EventType.TOUCH_START, this.cashoutFunc, this)
        this.initBall()
        for (let i = 0; i < this.tubeArr.length; i++) {
            this.tubeArr[i].on(cc.Node.EventType.TOUCH_START, this.clickCube, this)
        }
    }
    private clickCube(e) {
        if (!e.target.children.length && !this.IsBallUp) {  //点击空试管
            return;
        }
        //空管下落事件
        if (!e.target.children.length && this.IsBallUp) {
            this.fallNoneCubeDown(e)
            this.IsBallUp = false
            console.log('ka', this.totalArr);
            return
        }
        let item = e.target.children[e.target.children.length - 1].getComponent(Ball)
        let BallSpriteId = item.BallSpriteId
        let cubeId = item.cubeId  //0-4
        let BallIndex = item.BallId
        if (this.cubeFlagArr[cubeId] && !this.IsBallUp && this.totalArr[cubeId].length) {   //小球升起逻辑
            cc.tween(item.node).delay(0.05)
                .to(.3, { y: TopY }, { easing: 'quadOut' })
                .start()
            this.IsBallUp = true
            this.cubeFlagArr[cubeId] = false
            for (let i = this.totalArr[cubeId].length - 1; i >= 0; i--) {
                if (this.totalArr[cubeId][i].BallSpriteId == BallSpriteId) {
                    this.totalArr[cubeId][i].isUp = true
                } else {
                    break;
                }
            }
        } else if (!this.cubeFlagArr[cubeId] && this.IsBallUp) {  // 下降原位置
            cc.tween(item.node).delay(0.06)
                .to(.3, { y: BottomY + BallGap * BallIndex }, { easing: 'quadOut' })
                .start()
            this.IsBallUp = false
            this.cubeFlagArr[cubeId] = true
            for (let i = this.totalArr[cubeId].length - 1; i >= 0; i--) {
                if (this.totalArr[cubeId][i].BallSpriteId == BallSpriteId) {
                    this.totalArr[cubeId][i].isUp = false
                } else {
                    break;
                }
            }
        } //移动非空试管事件 
        else if (this.cubeFlagArr[cubeId] && this.IsBallUp) {
            console.log('移动到其他试管');
            let TargetCubeId = Number(e.target.name) //目标试管
            let TargetCubeItemArr = null
            if(this.totalArr[TargetCubeId].length >= Ball_Max){
                console.log('cube contained Max');
                return;
            }
            for (let i = 0; i < Object.keys(this.totalArr).length; i++) {
                for (let j = this.totalArr[i].length - 1; j >= 0; j--) {
                    if (this.totalArr[i][j].isUp) {
                        let cubeDis = 0  //试管间隔
                        TargetCubeItemArr = this.totalArr[TargetCubeId]
                        console.log(this.totalArr[i][j].isUp, 'jayup', this.totalArr[i][j].BallSpriteId, TargetCubeItemArr[TargetCubeItemArr.length - 1].BallSpriteId);
                        if (this.totalArr[i][j].BallSpriteId == TargetCubeItemArr[TargetCubeItemArr.length - 1].BallSpriteId) {
                            cc.tween(this.totalArr[i][j].node).delay(0.5-0.1*j)
                                .to(0.05*(Ball_Max-j), { y: TopY }, { easing: 'quadOut' })
                                .call(() => {
                                    this.totalArr[i][j].node.parent = this.tubeArr[TargetCubeId]
                                    cubeDis = i - TargetCubeId
                                    this.totalArr[i][j].node.x = CubeGap * cubeDis
                                    let cubeNum = this.totalArr[TargetCubeId].length
                                    this.totalArr[i][j].BallId = cubeNum
                                    this.totalArr[TargetCubeId].push(this.totalArr[i][j])
                                    cc.tween(this.totalArr[i][j].node)
                                        .to(Math.abs(cubeDis)*0.12, { x: 0 }, { easing: 'quadOut' })
                                        .to((Ball_Max-cubeNum) * 0.14, { y: BottomY + BallGap * cubeNum }, { easing: 'quadOut' })
                                        .call(() => {
                                            this.cubeFlagArr[TargetCubeId] = this.cubeFlagArr[i] = true
                                            this.totalArr[i][j].cubeId = TargetCubeId
                                            this.totalArr[i][j].isUp = false
                                            this.totalArr[i].pop()
                                            console.log('jaytest',this.totalArr);
                                            this.IsBallUp = false
                                        }).start()
                                }).start()
                        } else {
                            console.log('颜色不匹配');
                            return
                        }
                    }
                }
            }
        }
    }
    //下落空管事件
    private fallNoneCubeDown(e) {
        for (let i = 0; i < Object.keys(this.totalArr).length - 2; i++) {
            for (let j = this.totalArr[i].length - 1; j >= 0; j--) {
                let TargetCubeId = Number(e.target.name)
                if (this.totalArr[i][j].isUp) {
                    cc.tween(this.totalArr[i][j].node).delay(0.5-0.1*j)
                        .to(.2, { y: TopY })
                        .call(() => {
                            this.totalArr[i][j].node.parent = this.tubeArr[TargetCubeId]
                            this.totalArr[i][j].node.x = CubeGap * (i - TargetCubeId)
                            let CubeNum = this.totalArr[TargetCubeId].length
                            this.totalArr[i][j].BallId = this.totalArr[TargetCubeId].length == 0 ? 0 : this.totalArr[TargetCubeId].length
                            this.totalArr[TargetCubeId].push(this.totalArr[i][j])
                            cc.tween(this.totalArr[i][j].node)
                                .to(.35, { x: 0 })
                                .to(.35, { y: BottomY + CubeNum * BallGap })
                                .call(() => {
                                    this.cubeFlagArr[i] = true
                                    this.totalArr[i][j].cubeId = TargetCubeId
                                    this.totalArr[i][j].isUp = false
                                    this.totalArr[i].pop()
                                })
                                .start()
                        })
                        .start()
                }
            }
        }
        console.log(this.totalArr);
    }
    private initBall() {
        this.randomArr = [ItemType.pink, ItemType.red, ItemType.blue, ItemType.purple, ItemType.yellow]
        this.randomMap = new Map<number, Set<number>>()
        for (let i = 1; i <= this.randomArr.length; i++) {
            this.randomMap.set(i, 5)
            if (this.cubeFlagArr[i - 1] == null) {
                this.cubeFlagArr[i - 1] = true
            }
        }
        //初始化空管
        this.cubeFlagArr[5] = this.cubeFlagArr[6] = true
        let randomType = null
        let nowNum = 5
        for (let i = 0; i < this.tubeArr.length - 2; i++) {
            for (let j = 0; j < Ball_Max; j++) {
                randomType = this.randomArr[this.getRandomInt(0, this.randomArr.length - 1)]
                nowNum = this.randomMap.get(randomType)
                this.randomMap.set(randomType, --nowNum)
                let ballItem = cc.instantiate(this.ballPre).getComponent(Ball)
                ballItem.initItem(randomType, 0, BottomY + BallGap * j, i, j)
                ballItem.node.parent = this.tubeArr[i]
                if (this.totalArr[i] == null) {
                    this.totalArr[i] = []
                }
                this.totalArr[i].push(ballItem)
                if (nowNum <= 0) {
                    let index = this.randomArr.indexOf(randomType)
                    this.randomArr.splice(index, 1)
                }
            }
        }
        //初始化空管
        this.totalArr[this.tubeArr.length - 2] = []
        this.totalArr[this.tubeArr.length - 1] = []
        console.log(this.randomMap, this.totalArr, this.cubeFlagArr);
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
        this.bg.node.x = isVerTical ? 0 : - (cc.winSize.width / 3.5)
        this.resultNode.scale = isVerTical ? 1 : 1.5
        this.tipLabel.node.active = isVerTical
        this.tipLabel1.node.active = !isVerTical
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    protected onDisable(): void {
        this.cashOutBtn.off(cc.Node.EventType.TOUCH_START, this.cashoutFunc, this)
    }
}   
