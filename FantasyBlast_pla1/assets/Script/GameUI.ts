import Ball from "./Ball";
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
const TotalBallNum = 30
@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private bornNode:cc.Node = null
    @property(cc.Node)
    private bottomBg:cc.Node = null;
    @property(cc.Prefab)
    private moneyPre: cc.Prefab = null;
    @property(cc.Node)
    private topCard: cc.Node = null;
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

    private ballPool:cc.NodePool = null
    private allItemArr: any = {}
    private gameColmun: number = 9
    private gameRow: number = 8
    private totalArr: Ball[] = []
    private _data: any = null;
    private monerChange: MoneyChange = null;
    private amount: number = 0
    private bgmAudioFlag: boolean = true
    protected onLoad(): void {
        cc.director.getPhysicsManager().enabled = true
    }
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
        this.initPool()
        this.initBlock()
        this.resultNode.active = false
        this.resize()
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true, this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
    }
    private initPool(){
        this.ballPool = new cc.NodePool()
        for(let i =0;i<30;i++){
            let item = cc.instantiate(this.BoxPrefab)
            this.ballPool.put(item)
        }
    }
    private initBlock() {
        this._data = BoxManager.instance.getData()
        let loadCounter = 0
        for (let i = 0; i < TotalBallNum ; i++) {//Object.keys(this._data).length
            let itemPre = null
            if(this.ballPool.size()>0){
                itemPre = this.ballPool.get()
            }else{
                itemPre = cc.instantiate(this.BoxPrefab)
            }
            itemPre.parent = this.bornNode
            let item = itemPre.getComponent(Ball)
            item.initItem(i, this._data[i].spriteIndex,cc.v2(i*15,-i*5) , this._data[i].isEmpty, () => {
                this.totalArr.push(item)
                loadCounter++
                if(loadCounter == TotalBallNum){
                    this.totalArr.sort((a,b)=>a.BallId - b.BallId)
                }
            })
            item.node.parent = this.chessBox
        }
        this.schedule(this.BallListenFunc,0.5,cc.macro.REPEAT_FOREVER,0)
    }
    //监听小球是否静止
    private BallListenFunc(){
        let count = 0
        for(let i = 0; i < TotalBallNum;i++){
            if(this.totalArr[i].isStop){
                count++
                if(count == TotalBallNum){  //全部静止
                    console.log('全部静止');
                    this.unschedule(this.BallListenFunc)
                    console.log(this.totalArr[0].BallId);
                    let rayStart = cc.v2(this.totalArr[0].node.position)
                    rayStart = this.totalArr[0].node.parent.convertToWorldSpaceAR(rayStart)
                    // let rayEnd = cc.v2(rayStart.x-400,rayStart.y)
                    // let result = cc.director.getPhysicsManager().rayCast(rayStart,rayEnd,cc.RayCastType.All)
                    // result.forEach((item)=>{
                    //     console.log(item.collider.node.name);
                    // })
                    let rect1 = cc.rect(rayStart.x-100,rayStart.y,100,100)
                    let list = cc.director.getPhysicsManager().testAABB(rect1)
                    console.log(list);
                }
            }
        }
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
