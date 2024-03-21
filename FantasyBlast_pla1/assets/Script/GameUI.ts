import Ball from "./Ball";
import { BoxManager } from "./box/BoxManager";
import HorBall from "./HorBall";
import Item from "./Item";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;
export const enum ItemType {
    pink = 1,
    red = 2,
    blue = 3,
    purple = 4,
    orange = 5,
    green = 6
}
const TotalBallNum = 30
@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private tipBg:cc.Node = null
    @property(cc.Node)
    private guideFinger: cc.Node = null
    @property(cc.Node)
    private skillNode: cc.Node = null
    @property(cc.Node)
    private bornNode: cc.Node = null
    @property(cc.Prefab)
    private moneyPre: cc.Prefab = null;
    @property(cc.Node)
    private mask: cc.Node = null;
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Label)
    private tipLabel1: cc.Label = null;
    @property(cc.Node)
    private finger: cc.Node = null;
    @property(cc.Label)
    private monlabel: cc.Label = null;
    @property(cc.Node)
    private resultNode: cc.Node = null;
    @property(cc.Prefab)
    private BoxPrefab: cc.Prefab = null;
    @property(cc.Node)
    private horBg:cc.Node = null
    //横屏
    @property(cc.Node)
    private horGuideFinger:cc.Node = null
    @property(cc.Node)
    private verTicalBg:cc.Node = null
    @property(cc.Node)
    private honBornNode:cc.Node = null
    @property(cc.Prefab)
    private HorBoxPrefab: cc.Prefab = null;
    @property(cc.Label)
    private HorMonlabel:cc.Label = null
    @property(cc.Node)
    private horSkillNode:cc.Node = null;
    @property(cc.Node)
    private horBottomBg: cc.Node = null;
    @property(cc.Node)
    private HorresultNode: cc.Node = null;

    private clearArr: any = []
    private itemTypeArr: any = []
    private ballPool: cc.NodePool = null
    private totalArr: Ball[] = []
    private _data: any = null;
    private monerChange: MoneyChange = null;
    private amount: number = 0
    private verticalFlag: boolean = true
    //横板
    private hornFlag:boolean = true
    private HonrTotalArr: Ball[] = []
    private HorBallPool:cc.NodePool = null
    private HorItemTypeArr:any = []
    private horClearArr:any = []
    private HorMoneyChange: MoneyChange = null;
    private isVerTical:boolean = true
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
            if(this.verticalFlag && this.isVerTical){
                cc.audioEngine.pauseAll()
                this.verticalFlag = false
                cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
                cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, true, 1)
                this.tipBg.active = this.finger.active = this.mask.active = false
                setTimeout(() => {
                    if(cc.winSize.height > cc.winSize.width)
                    this.initVerticalBall()
                }, 400);
            }
            if(this.hornFlag && !this.isVerTical){
                cc.audioEngine.pauseAll()
                this.hornFlag = false
                cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
                cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip, true, 1)
                this.tipBg.active = this.finger.active = this.mask.active = false
                setTimeout(() => {
                    if(cc.winSize.width > cc.winSize.height)
                    this.initHornBall()
                }, 400);
            }
        })
        this.initPool()
        this.tipBg.active = this.finger.active = this.mask.active = true
        this.guideFinger.active = this.resultNode.active = this.HorresultNode.active = false
        this.resize()
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        let unit = LanguageManager.instance.getText(10001)
        this.monerChange = new MoneyChange(this.monlabel, true, this.amount)
        this.monerChange.prefix = unit
        this.monlabel.string = `${unit}${this.amount}.00`
        this.HorMoneyChange = new MoneyChange(this.HorMonlabel,true,this.amount)
        this.HorMoneyChange.prefix = unit
        this.HorMonlabel.string  = `${unit}${this.amount}.00`
    }
    private initPool() {
        this.ballPool = new cc.NodePool()
        for (let i = 0; i < 30; i++) {
            let item = cc.instantiate(this.BoxPrefab)
            this.ballPool.put(item)
        }
        this.HorBallPool = new cc.NodePool()
        for (let i = 0; i < 30; i++) {
            let item = cc.instantiate(this.HorBoxPrefab)
            this.HorBallPool.put(item)
        }
    }
    private initVerticalBall() {
        this._data = BoxManager.instance.getData()
        let loadCounter = 0
        for (let i = 0; i < TotalBallNum; i++) {//Object.keys(this._data).length
            let itemPre = null
            if (this.ballPool.size() > 0) {
                itemPre = this.ballPool.get()
            } else {
                itemPre = cc.instantiate(this.BoxPrefab)
            }
            itemPre.parent = this.bornNode
            let item = itemPre.getComponent(Ball)
            item.initItem(i, this._data[i].spriteIndex, cc.v2(i * 15, -i * 5), () => {
                this.totalArr.push(item)
                loadCounter++
                if (loadCounter == TotalBallNum) {
                    this.totalArr.sort((a, b) => a.BallId - b.BallId)
                }
            })
            item.node.parent = this.bornNode
        }
        this.schedule(this.BallListenFunc, 0.1, cc.macro.REPEAT_FOREVER, 5)
    }
    private initHornBall(){
        this._data = BoxManager.instance.getData()
        let loadCounter = 0
        for (let i = 0; i < TotalBallNum; i++) {//Object.keys(this._data).length
            let itemPre = null
            if (this.HorBallPool.size() > 0) {
                itemPre = this.HorBallPool.get()
            } else {
                itemPre = cc.instantiate(this.HorBoxPrefab)
            }
            itemPre.parent = this.honBornNode
            let item = itemPre.getComponent(HorBall)
            item.initItem(i, this._data[i].spriteIndex, cc.v2(i * 15, -i * 5), () => {
                this.HonrTotalArr.push(item)
                loadCounter++
                if (loadCounter == TotalBallNum) {
                    this.HonrTotalArr.sort((a, b) => a.BallId - b.BallId)
                }
            })
            item.node.parent = this.honBornNode
        }
        this.schedule(this.HornBallListenFunc, 0.1, cc.macro.REPEAT_FOREVER, 5)
    }
    //监听小球是否静止
    private BallListenFunc() {
        let count = 0
        for (let i = 0; i < TotalBallNum; i++) {
            if (!this.totalArr[i].isStop) return
            if (this.totalArr[i].isStop) {
                count++
                if (count == TotalBallNum) {  //全部静止
                    this.totalArr.forEach((item) => {
                        // item.node.on('clearEvent',this.clearNode,this)
                        if (item.spriteIndex == ItemType.red) {
                            this.itemTypeArr.push(item)
                        }
                    })
                    console.log('全部静止');
                    this.unschedule(this.BallListenFunc)
                    this.setClearBall()
                }
            }
        }
    }
    private HornBallListenFunc(){
        let count = 0
        for (let i = 0; i < TotalBallNum; i++) {
            if (!this.HonrTotalArr[i].isStop) return
            if (this.HonrTotalArr[i].isStop) {
                count++
                if (count == TotalBallNum) {  //全部静止
                    this.HonrTotalArr.forEach((item) => {
                        // item.node.on('clearEvent',this.clearNode,this)
                        if (item.spriteIndex == ItemType.red) {
                            this.HorItemTypeArr.push(item)
                        }
                    })
                    console.log('全部静止');
                    this.unschedule(this.HornBallListenFunc)
                    this.setHornClearBall()
                }
            }
        }
    }
    //消除最长路径逻辑
    private setClearBall() {
        let contactMap = new Map<number, Set<number>>()
        for (let i = 0; i < this.itemTypeArr.length; i++) {
            for (let j = 0; j < this.itemTypeArr.length; j++) {
                let colliderA = this.itemTypeArr[i].node.getComponent(cc.PhysicsCircleCollider)
                let colliderB = this.itemTypeArr[j].node.getComponent(cc.PhysicsCircleCollider)
                let posA = colliderA.node.convertToWorldSpaceAR(cc.v2(colliderA.offset.x, colliderA.offset.y))
                let posB = colliderB.node.convertToWorldSpaceAR(cc.v2(colliderB.offset.x, colliderB.offset.y))
                let dist = cc.v2(posA).sub(posB).mag()
                let radiusA = colliderA.radius * colliderA.node.scale
                let radiusB = colliderB.radius * colliderB.node.scale
                let isoverLap = (dist - 10) <= (radiusA + radiusB)
                if (isoverLap) {
                    let indexA = this.itemTypeArr[i].BallId
                    let indexB = this.itemTypeArr[j].BallId
                    if (!contactMap.has(indexA)) contactMap.set(indexA, new Set())
                    if (!contactMap.has(indexB)) contactMap.set(indexB, new Set())
                    contactMap.get(indexA).add(indexB)
                    contactMap.get(indexB).add(indexA)
                }
            }
        }
        console.log(contactMap, 'jaycontactMap');
        let visited = new Set<number>()
        let longestArr: number[] = []
        let currentArr: number[] = []
        function dfs(BallId: number) {
            visited.add(BallId)
            currentArr.push(BallId)
            if (currentArr.length > longestArr.length) {
                longestArr = [...currentArr]
            }
            for (let nextNodeId of contactMap.get(BallId)) {
                if (!visited.has(nextNodeId)) {
                    dfs(nextNodeId)
                }
            }
        }
        this.itemTypeArr.forEach((Item) => {
            if (!visited.has(Item.BallId)) {
                currentArr = []
                dfs(Item.BallId)
            }
        });
        console.log('最长路径', longestArr)
        let count = 0
        for (let i = 0; i < this.itemTypeArr.length; i++) {
            if (count == longestArr.length) break;
            for (let j = 0; j < longestArr.length; j++) {
                if (this.itemTypeArr[i].BallId == longestArr[j]) {
                    count++
                    this.clearArr.push(this.itemTypeArr[i])
                    break;
                }
            }
        }
        this.initClearEvent()
    }
    //懒得改通用了，直接copy
    private setHornClearBall() {
        let HorcontactMap = new Map<number, Set<number>>()
        for (let i = 0; i < this.HorItemTypeArr.length; i++) {
            for (let j = 0; j < this.HorItemTypeArr.length; j++) {
                let colliderA = this.HorItemTypeArr[i].node.getComponent(cc.PhysicsCircleCollider)
                let colliderB = this.HorItemTypeArr[j].node.getComponent(cc.PhysicsCircleCollider)
                let posA = colliderA.node.convertToWorldSpaceAR(cc.v2(colliderA.offset.x, colliderA.offset.y))
                let posB = colliderB.node.convertToWorldSpaceAR(cc.v2(colliderB.offset.x, colliderB.offset.y))
                let dist = cc.v2(posA).sub(posB).mag()
                let radiusA = colliderA.radius * colliderA.node.scale
                let radiusB = colliderB.radius * colliderB.node.scale
                let isoverLap = (dist - 10) <= (radiusA + radiusB)
                if (isoverLap) {
                    let indexA = this.HorItemTypeArr[i].BallId
                    let indexB = this.HorItemTypeArr[j].BallId
                    if (!HorcontactMap.has(indexA)) HorcontactMap.set(indexA, new Set())
                    if (!HorcontactMap.has(indexB)) HorcontactMap.set(indexB, new Set())
                    HorcontactMap.get(indexA).add(indexB)
                    HorcontactMap.get(indexB).add(indexA)
                }
            }
        }
        console.log(HorcontactMap, 'jaycontactMap');
        let Horvisited = new Set<number>()
        let HorlongestArr: number[] = []
        let HorcurrentArr: number[] = []
        function dfs(BallId: number) {
            Horvisited.add(BallId)
            HorcurrentArr.push(BallId)
            if (HorcurrentArr.length > HorlongestArr.length) {
                HorlongestArr = [...HorcurrentArr]
            }
            for (let nextNodeId of HorcontactMap.get(BallId)) {
                if (!Horvisited.has(nextNodeId)) {
                    dfs(nextNodeId)
                }
            }
        }
        this.HorItemTypeArr.forEach((Item) => {
            if (!Horvisited.has(Item.BallId)) {
                HorcurrentArr = []
                dfs(Item.BallId)
            }
        });
        console.log('最长路径', HorlongestArr)
        let count = 0
        for (let i = 0; i < this.HorItemTypeArr.length; i++) {
            if (count == HorlongestArr.length) break;
            for (let j = 0; j < HorlongestArr.length; j++) {
                if (this.HorItemTypeArr[i].BallId == HorlongestArr[j]) {
                    count++
                    this.horClearArr.push(this.HorItemTypeArr[i])
                    break;
                }
            }
        }
        this.HorinitClearEvent()
    }
    private initClearEvent() {
        for (let i = 0; i < this.clearArr.length; i++) {
            this.clearArr[i].setLight()
            this.clearArr[i].node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
            this.clearArr[i].node.on('clearEvent', this.clearNode, this)
            this.clearArr[i].canClear = true
            this.clearArr[i].bindClickEvent()
        }
    }
    private HorinitClearEvent() {
        for (let i = 0; i < this.horClearArr.length; i++) {
            this.horClearArr[i].setLight()
            this.horClearArr[i].node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0)
            this.horClearArr[i].node.on('HorClearEvent', this.HorClearNode, this)
            this.horClearArr[i].canClear = true
            this.horClearArr[i].bindClickEvent()
        }
    }
    private clearNode() {
        let pos = Utils.getLocalPositionWithOtherNode(this.node,this.monlabel.node)
        Anim.ins().ShowFlyAni(this.moneyPre,this.node,15,pos,()=>{
        },this)
        setTimeout(() => {
            this.monerChange.play(LanguageManager.instance.formatUnit(100),0.5,()=>{},this) 
        }, 500);
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip,false,1)
        for (let i = 0; i < TotalBallNum; i++) {
            if (this.totalArr[i].canClear) {
                this.totalArr[i].node.getComponent(cc.Sprite).spriteFrame = null
                this.totalArr[i].node.children[0].active = true
                setTimeout(() => {
                    this.totalArr[i].node.destroy()
                    this.mask.active = true
                    this.guideFinger.active = true
                    Utils.SetScale(this.guideFinger, 0.7, 0.6, 0.4)
                    this.skillNode.on(cc.Node.EventType.TOUCH_START, this.BoomFunc, this)
                }, 500);
            }
        }
    }
    private HorClearNode() {
        let pos = Utils.getLocalPositionWithOtherNode(this.node,this.HorMonlabel.node)
        Anim.ins().ShowFlyAni(this.moneyPre,this.node,15,pos,()=>{
        },this)
        setTimeout(() => {
            this.HorMoneyChange.play(LanguageManager.instance.formatUnit(100),0.5,()=>{},this) 
        }, 500);
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip,false,1)
        for (let i = 0; i < TotalBallNum; i++) {
            if (this.HonrTotalArr[i].canClear) {
                this.HonrTotalArr[i].node.getComponent(cc.Sprite).spriteFrame = null
                this.HonrTotalArr[i].node.children[0].active = true
                setTimeout(() => {
                    this.mask.active = true
                    this.horGuideFinger.active = true
                    Utils.SetScale(this.horGuideFinger,1.1,1,0.4)
                    this.HonrTotalArr[i].node.destroy()
                    this.horSkillNode.on(cc.Node.EventType.TOUCH_START, this.HorBoomFunc, this)
                }, 500);
            }
        }
    }
    //爆炸全消
    private BoomFunc() {
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
        this.mask.active = this.guideFinger.active = false
        this.skillNode.children[0].getComponent(cc.Label).string = '2'
        this.skillNode.off(cc.Node.EventType.TOUCH_START, this.BoomFunc, this)
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip,false,1)
        for (let i = 0; i < this.totalArr.length; i++) {
            if (this.totalArr[i].node == null) continue
            this.totalArr[i].node.getComponent(cc.Sprite).spriteFrame = null
            this.totalArr[i].node.children[0].active = true
            setTimeout(() => {
                this.totalArr[i].node.destroy()
            }, 500);
        }
        let pos = Utils.getLocalPositionWithOtherNode(this.node,this.monlabel.node)
        Anim.ins().ShowFlyAni(this.moneyPre,this.node,20,pos,()=>{
        },this)
        setTimeout(() => {
            this.monerChange.play(LanguageManager.instance.formatUnit(300),0.7,()=>{
                Utils.showUI(this.resultNode,RESSpriteFrame.instance.comeOutAudioClip,0.4,true,1.1,1,()=>{
                    cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                },0.3,0.3)
            },this)
        }, 800);
    }
    private HorBoomFunc(){
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
        this.mask.active = this.horGuideFinger.active = false
        this.horSkillNode.children[0].getComponent(cc.Label).string = '2'
        this.horSkillNode.off(cc.Node.EventType.TOUCH_START, this.BoomFunc, this)
        cc.audioEngine.play(RESSpriteFrame.instance.clearAudioClip,false,1)
        for (let i = 0; i < this.HonrTotalArr.length; i++) {
            if (this.HonrTotalArr[i].node == null) continue
            this.HonrTotalArr[i].node.getComponent(cc.Sprite).spriteFrame = null
            this.HonrTotalArr[i].node.children[0].active = true
            setTimeout(() => {
                this.HonrTotalArr[i].node.destroy()
            }, 500);
        }
        let pos = Utils.getLocalPositionWithOtherNode(this.node,this.HorMonlabel.node)
        Anim.ins().ShowFlyAni(this.moneyPre,this.node,20,pos,()=>{
        },this)
        setTimeout(() => {
            this.HorMoneyChange.play(LanguageManager.instance.formatUnit(300),0.7,()=>{
                Utils.showUI(this.HorresultNode,RESSpriteFrame.instance.comeOutAudioClip,0.4,true,1.55,1.35,()=>{
                    cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                },0.3,0.4)
            },this)
        }, 800);
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.isVerTical = isVerTical
        this.verTicalBg.active = Boolean(isVerTical)
        if(isVerTical){
            this.HorresultNode.active = false
        }
        if(!isVerTical){
            this.resultNode.active = false
        }
        this.horBg.active = this.horBottomBg.active = !isVerTical
        this.mask.children[0].scale = isVerTical ? 1 : 2
        if(!this.hornFlag|| !this.verticalFlag){
            cc.audioEngine.pauseAll() 
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
        this.tipLabel.node.active = isVerTical
        this.tipLabel1.node.active = !isVerTical
        if(!this.isVerTical && this.hornFlag){
            this.tipBg.active = this.finger.active = this.mask.active = true
        }
        if(this.isVerTical && this.verticalFlag){
            this.tipBg.active = this.finger.active = this.mask.active = true
        }
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
}   
