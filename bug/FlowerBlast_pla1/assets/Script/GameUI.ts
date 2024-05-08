import { BoxManager } from "./box/BoxManager";
import BoxItem from "./BoxItem";
import { Direction } from "./CommonMacro";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Prefab)
    private boxPrefab: cc.Prefab = null;
    @property(cc.Node)
    private boxBg: cc.Node = null;
    @property(cc.Node)
    private bornNode: cc.Node = null;
    @property(cc.Node)
    private bornArrNode: cc.Node[] = []

    private canPlayMusic: boolean = false
    private data: any = null;
    private gameRow: number = 8
    private gameColmun: number = 8
    private bornPool: cc.NodePool;
    private GWidth: number = 84
    private itemArr: any = []
    private allItemArr: any = {};
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            this.canPlayMusic = true
        })
        this.resize()
        this.loadItems()
    }
    private async loadItems(){
        let promises = []
        this.data = BoxManager.instance.getData()
        let keysArr = Object.keys(this.data)
        for (let i = 0; i < keysArr.length; i++) {
            let boxPrefab = cc.instantiate(this.boxPrefab)
            let item = boxPrefab.getComponent(BoxItem)
            item.node.parent = this.boxBg
            let pos = new cc.Vec3(this.data[i].posX, this.data[i].posY)

            promises.push(item.initItem(i, this.data[i], pos, () => {
                if (this.data[i].FirstCanClick) {
                    item.setOnLight()
                    item.node.on(cc.Node.EventType.TOUCH_START, this.firstClear, this)
                }
                this.itemArr.push(item)
            }))
        }
        await Promise.all(promises)
        this.itemArr = this.itemArr.sort((a,b)=>a.BoxId - b.BoxId)
        this.initData()
    }
    private firstClear() {
        console.log('clickjay');
        for (let i = 0; i < this.gameRow; i++) {
            for (let j = 0; j < this.gameColmun; j++) {
                if (Boolean(this.allItemArr[i][j].FirstCanClick)) {
                    this.allItemArr[i][j].getComponent(cc.Sprite).spriteFrame = null
                    this.allItemArr[i][j].ClearSystem.active = true
                    this.allItemArr[i][j].node.off(cc.Node.EventType.TOUCH_START, this.firstClear, this)
                }
            } 
        }
    }
    private initData() {
        let keysArr = Object.keys(this.data)
        let row = this.data[keysArr.length - 1].row
        let column = this.data[keysArr.length - 1].column
        let index = 0
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                if (!this.allItemArr[i]) {
                    this.allItemArr[i] = {}
                }
                this.allItemArr[i][j] = this.itemArr[index++]
            }
        }
        console.log('jay', this.allItemArr);
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
    }
    private cashoutFunc() {
        console.log('跳转');
        this.canPlayMusic && cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    protected onDisable(): void {

    }
}   
