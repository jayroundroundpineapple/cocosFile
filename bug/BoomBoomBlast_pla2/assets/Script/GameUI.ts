import { BoxManager } from "./box/BoxManager";
import BoxItem from "./BoxItem";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";


const { ccclass, property } = cc._decorator;
const upNum = 6
@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private coinNode:cc.Node = null;
    @property(cc.Node)
    private BoxUI:cc.Node = null;
    @property(cc.Label)
    private honMoneyLabel:cc.Label = null
    @property(cc.Node)
    private HonBg:cc.Node  = null
    @property(cc.Node)
    private verBg:cc.Node = null;
    @property(cc.SpriteFrame)
    private moneyFrame:cc.SpriteFrame[] = []
    @property(cc.Prefab)
    private moneyPrefab:cc.Prefab = null
    @property(cc.Label)
    private moneyLabel:cc.Label = null
    @property(cc.Node)
    private finger:cc.Node = null
    @property(cc.Node)
    private BoxBg: cc.Node = null;
    @property(cc.Node)
    private maskNode: cc.Node = null;
    @property(cc.Label)
    private tipLabel: cc.Label = null;
    @property(cc.Label)
    private tipLabel1: cc.Label = null;
    @property(cc.Node)
    private resultNode: cc.Node
    @property(cc.Prefab)
    private BoxPrefab: cc.Prefab = null;
    @property(cc.Node)
    private moneyParticle:cc.Node = null
    @property(cc.Node)
    private blockBg:cc.Node = null;

    private secondFlag:boolean = false
    private flag:boolean = true
    private moneyChange:MoneyChange = null
    private moneyChange1:MoneyChange = null
    private canPlayMusic:boolean = false
    private amount:number = 0 
    private RowColmun: number = 9
    private allItemArr: any = {}
    private _data: any = null;
    private TotalNodeArr: BoxItem[] = []
    private gapArr: any = []
    private blockPool: cc.NodePool = new cc.NodePool()
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        this.finger.zIndex = 9
        for(let i = 0;i < 9;i++){
            this.gapArr.push(0)
        }
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            this.canPlayMusic = true
        })
        this.maskNode.active = this.resultNode.active = this.BoxUI.active = this.coinNode.active = false
        let unit = LanguageManager.instance.getText(10001)
        this.amount = LanguageManager.instance.formatUnit(this.amount)
        this.moneyChange = new MoneyChange(this.moneyLabel,true,this.amount)
        this.moneyChange1 = new MoneyChange(this.honMoneyLabel,true,this.amount)
        this.moneyChange1.prefix = unit
        this.honMoneyLabel.string = `${this.moneyChange1.prefix}${this.amount}.00`
        this.moneyChange.prefix = unit
        this.moneyLabel.string = `${this.moneyChange.prefix}${this.amount}.00`
        this.resize()
        this.initBlock()
    }
    private createInPool(nodePool: cc.NodePool, Prefab: cc.Prefab): cc.Node {
        if (nodePool.size() <= 0) {
            nodePool.put(cc.instantiate(Prefab))
        }
        return nodePool.get()
    }
    private recyle(nodePool: cc.NodePool, node: cc.Node) {
        nodePool.put(node)
    }
    private initBlock() {
        this._data = BoxManager.instance.getData()
        let totalNum = Object.keys(this._data).length
        let loadCounter = 0
        for (let i = 0; i < totalNum; i++) {
            let BoxPre = this.createInPool(this.blockPool, this.BoxPrefab)
            let item = BoxPre.getComponent(BoxItem)
            item.node.parent = this.BoxBg
            let pos = new cc.Vec3(this._data[i].posX, this._data[i].posY, 0)
            item.initItem(i, this._data[i].spriteIndex, pos, this._data[i].isEmpty,this._data[i].gap,() => {
                this.TotalNodeArr.push(item)
                loadCounter++
                if (loadCounter == totalNum) {
                    this.TotalNodeArr.sort((a, b) => a.id - b.id)
                    this.initData()
                }
            })
            if (this._data[i].CanFirstClick) {
                item.node.on('OnFirstClickEvent', this.onFirstClickEvent, this)
                cc.tween(item.node)
                    .repeatForever(
                        cc.tween()
                            .to(.6, { scale: 1.1, opacity: 50 })
                            .to(.6, { scale: 1, opacity: 255 })
                    ).start()
            }
        }
    }
    private initData() {
        this._data = BoxManager.instance.getData()
        let keysArrIndex = Object.keys(this._data).length - 1
        let row = this._data[keysArrIndex].row
        let colmun = this._data[keysArrIndex].column
        let index = 0
        for (let i = 0; i <= row; i++) {
            for (let j = 0; j <= colmun; j++) {
                if (!this.allItemArr[i]) {
                    this.allItemArr[i] = {}   //行
                }
                this.allItemArr[i][j] = this.TotalNodeArr[index++]
            }
        }
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private onFirstClickEvent(node) {
       if(this.flag){
        this.flag = false
         //第一次点击
         this.finger.active = false
         cc.audioEngine.play(RESSpriteFrame.instance.ClearClip,false,1)
         for (let i = 0; i < 3; i++) {
             for (let j = 0; j < this.RowColmun; j++) {
                 if (this._data[i * this.RowColmun + j].CanFirstClick) {
                     this.allItemArr[i][j].setClear(true, () => {
                         this.allItemArr[i][j].isEmpty = true
                         this.recyle(this.blockPool, this.allItemArr[i][j].node)
                         if (i == 2 && j == 7) {
                             this.createFirstNew()
                         }
                     })
                 }
             }
         }
         this.canPlayMusic &&  cc.audioEngine.play(RESSpriteFrame.instance.GreatClip,false,1)
         let numId = 0 
         if(this.canPlayMusic){
             numId = cc.audioEngine.play(RESSpriteFrame.instance.NumberUpClip,false,1)
         }   
         let target = this.moneyLabel.node
         if(cc.winSize.width>cc.winSize.height){
             target = this.honMoneyLabel.node
         }
         let point = Utils.getLocalPositionWithOtherNode(this.node,target)
         Anim.ins().ShowFlyAni(this.moneyPrefab,this.node,15,point,()=>{
             EffectUtils.removeTweens(target)
             this.canPlayMusic && cc.audioEngine.pause(numId)
         })
         setTimeout(() => {
             this.moneyChange.play(LanguageManager.instance.formatUnit(600),0.8,()=>{
             })
             this.moneyChange1.play(LanguageManager.instance.formatUnit(600),0.8,()=>{
             })
         }, 500);
       }
    }
    //生成新的
    private createFirstNew() {
        let NewNum: number = 0
        for (let i = 0; i < this.RowColmun; i++) {
            for (let j = 0; j < this.RowColmun; j++) {
                if (this.allItemArr[i][j].isEmpty) {
                    NewNum++
                    let boxPre = this.createInPool(this.blockPool, this.BoxPrefab)
                    let item = boxPre.getComponent(BoxItem)
                    cc.Tween.stopAllByTarget(item.node)
                    item.node.off('OnFirstClickEvent', this.onFirstClickEvent, this)
                    item.setPostionY(item.y + 65 * 5)
                    item.setSprite()
                    item.node.opacity = 255
                    item.node.parent = this.BoxBg
                    cc.tween(item.node)
                        .to(.25, { y: item.originPosY }, { easing: 'quadIn' }).
                        call(() => {
                            this.allItemArr[i][j].isEmpty = false
                            if (i == 2 && j == 7) {
                                this.updateSecond()
                            }
                        })
                        .start()
                }
            }
        }
    }
    //第二次点击下落
    private fallDown() {
        for (let j = 0; j < this.RowColmun; j++) {  // 列
            let startIndex = -1;
            let endIndex = -1;
            for (let i = 0; i < this.RowColmun; i++) { // 行
                if (i != 0 && this.allItemArr[i][j].isEmpty && !this.allItemArr[i - 1][j].isEmpty) {
                    startIndex = i;
                }
                if ((i != this.RowColmun - 1 && this.allItemArr[i][j].isEmpty && !this.allItemArr[i + 1][j].isEmpty) || (i == this.RowColmun - 1 && !this.allItemArr[i][j].isEmpty)) {
                    endIndex = i;
                }
                if (startIndex != -1 && endIndex != -1) {
                    let gap = endIndex - startIndex + 1;
                    this.gapArr[j] = startIndex*65 //往上走
                    this.DoFallAnim(i, j, startIndex, gap);
                    // 重置 Start 和 End 以防止重复处理
                    startIndex = -1;
                    endIndex = -1;
                }
            }
        }
        setTimeout(()=>{
            this.createSecond();
       },1000)
        let target = this.moneyLabel.node
        if(cc.winSize.width>cc.winSize.height){
            target = this.honMoneyLabel.node
        }
        let point = Utils.getLocalPositionWithOtherNode(this.node,target)
        this.moneyChange.play(LanguageManager.instance.formatUnit(2000),1.7,()=>{
            
        })
        this.moneyChange1.play(LanguageManager.instance.formatUnit(2000),1.7,()=>{
            
        })
        let numId =0
        if(this.canPlayMusic){
           numId = cc.audioEngine.play(RESSpriteFrame.instance.NumberUpClip,false,1)
        }
        let resultNodeScale:number = cc.winSize.height > cc.winSize.width ? 1.1 : 1.45
        let resultNodeScale1:number = cc.winSize.height > cc.winSize.width ? 1 : 1.35
        setTimeout(() => {
            Anim.ins().ShowFlyAni(this.moneyPrefab,this.node,25,point,()=>{
                EffectUtils.removeTweens(target)
                this.canPlayMusic && cc.audioEngine.pause(numId)
                this.maskNode.active = true
                Utils.showUI(this.BoxUI,RESSpriteFrame.instance.comeOutClip,10.5,this.canPlayMusic,resultNodeScale,resultNodeScale1,()=>{
                    this.coinNode.active = true
                    this.BoxUI.active = false
                    Utils.showUI(this.resultNode,RESSpriteFrame.instance.comeOutClip,15.2,this.canPlayMusic,resultNodeScale,resultNodeScale1,()=>{
                        let index = 0
                        switch(cc.sys.language){
                            case 'zh'||'en':
                                index = 0
                                break;
                            case 'ja':
                                index=1
                                break;
                            case 'ko':
                                index=2
                                break;
                            case 'de'||'es'||'fr':
                                index=3
                                break;
                            default:
                                index=0
                        }
                        this.moneyParticle.getComponent(cc.ParticleSystem).spriteFrame = this.moneyFrame[index]
                        cc.audioEngine.play(RESSpriteFrame.instance.cherrUpClip,false,1)
                    })
                },0.8,0.4)
            })
        }, 20);
    }
    private DoFallAnim(row: number, colmun: number, startIndex: number, gap: number) {
        for (let i = startIndex-1; i >= 0; i--) {
            let item = this.allItemArr[i][colmun]
            cc.tween(item.node)
                .to(0.25, { y: item.y - 65 * gap }, { easing: "quadIn" })
                .call(() => {
                    // let tempY = this.allItemArr[i][colmun].originPosY
                    // this.allItemArr[i + gap][colmun].originPosY = this.allItemArr[i][colmun].originPosY
                    // this.allItemArr[i][colmun].originPosY = tempY
                    let temp = this.allItemArr[i][colmun];
                    this.allItemArr[i][colmun] = this.allItemArr[i + gap][colmun];
                    this.allItemArr[i + gap][colmun] = temp;
                    this.allItemArr[i][colmun].isEmpty = true;
                    this.allItemArr[i + gap][colmun].isEmpty = false;
                    this.allItemArr[i+gap][colmun].gap = startIndex
                    // 在节点回收之前重置或更新状态
                     this.recyle(this.blockPool, this.allItemArr[i][colmun].node);
                    // 动画结束后，确保生成新的补充节点逻辑触发处于正确的状态更新之后
                }).start();
        }
    }
    private createSecond() {
        let NewNum: number = 0
        for (let j = 0; j < this.RowColmun; j++) {  //列
            for (let i = 0; i < this.RowColmun; i++) {  //行
                console.log(`second${i+1}行${j+1}列`,this.allItemArr[i][j].originPosY);
                if (this.allItemArr[i][j].isEmpty) {
                    NewNum++
                    let boxPre = this.createInPool(this.blockPool, this.BoxPrefab)
                    let item = boxPre.getComponent(BoxItem)
                    cc.Tween.stopAllByTarget(item.node)
                    item.node.off('sendClickEvent', this.secondClickFunc, this)
                    item.setPostionY(item.y + 65 * 0)
                    item.setSprite()
                    item.node.opacity = 255
                    item.node.parent = this.BoxBg

                    cc.tween(item.node)
                        .to(2.45, { y: (item.originPosY+this.allItemArr[i][j].gap*65)}, { easing: 'quadIn' }).
                        call(() => {
                            this.allItemArr[i][j].isEmpty = false
                        })
                        .start()
                }
            }
        }
    }
    private updateSecond() {
        this.secondFlag = true
        for (let i = 0; i < this.RowColmun; i++) {
            for (let j = 0; j < this.RowColmun; j++) {
                if (this._data[i * this.RowColmun + j].spriteIndex == 3) {
                    let item = this.allItemArr[i][j]
                    let that = this
                    item.node.on('sendClickEvent', this.secondClickFunc, this)
                    cc.tween(item.node)
                        .repeatForever(
                            cc.tween()
                                .to(.6, { scale: 1.1, opacity: 50 })
                                .to(.6, { scale: 1, opacity: 255 })
                        ).start()
                }
            }
        }
    }
    private secondClickFunc() {
        if(this.secondFlag){
            this.secondFlag = false
            for (let i = 0; i < this.RowColmun; i++) {
                for (let j = 0; j < this.RowColmun; j++) {
                    console.log(`first${i+1}行${j+1}列`,this.allItemArr[i][j].originPosY);
                    if (this._data[i * this.RowColmun + j].spriteIndex == 3) {
                        this.allItemArr[i][j].setClear(true, ()=> {
                            this.allItemArr[i][j].isEmpty = true
                            this.recyle(this.blockPool, this.allItemArr[i][j].node)
                        })
                    }
                    setTimeout(() => {
                        if (i == this.RowColmun - 1 && j == this.RowColmun - 1) {
                            this.fallDown()
                        }
                    }, 300)
                }
            }
            cc.audioEngine.pauseAll()
            this.canPlayMusic && cc.audioEngine.play(RESSpriteFrame.instance.ClearClip,false,1)
            this.canPlayMusic && cc.audioEngine.play(RESSpriteFrame.instance.unBelieveClip,false,1)
        }
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.verBg.active = isVerTical
        this.HonBg.active = !isVerTical
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
        this.tipLabel.node.active = isVerTical ? true: false
        this.tipLabel1.node.active = isVerTical ? false : true
        this.blockBg.scale = isVerTical ? 1 : 1.5
        this.resultNode.scale = isVerTical ? 1 : 1.5
        this.blockBg.getComponent(cc.Widget).right = isVerTical ? -15.5: cc.winSize.width / 30
        if(isVerTical){
            this.blockBg.getComponent(cc.Widget).bottom = cc.winSize.height / 30
            this.blockBg.getComponent(cc.Widget).isAlignBottom = false
        }else{
            this.blockBg.getComponent(cc.Widget).isAlignBottom = true
            this.blockBg.getComponent(cc.Widget).bottom = cc.winSize.height / 15
        }
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    protected onDisable(): void {
        //this.cashOutBtn.off(cc.Node.EventType.TOUCH_START, this.cashoutFunc, this)
    }
}   
