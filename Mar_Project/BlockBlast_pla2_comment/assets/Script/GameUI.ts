import CommentItem from "./CommentItem";
import RESSpriteFrame from "./RESSpriteFrame";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Node)
    private picNode:cc.Node = null
    @property(cc.Node)
    private resultNode:cc.Node = null;
    @property(cc.Node)
    private bgNode:cc.Node = null
    @property(cc.Node)
    private nodeBox: cc.Node = null
    @property(cc.Node)
    private maskNode: cc.Node = null
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null
    @property(cc.SpriteFrame)
    private bgArr:cc.SpriteFrame[] = []

    private itemArr: any = []
    private secondFlag: boolean = false
    private ItemPool:cc.NodePool = null
    private index:number = 1
    private firstFlag:boolean = true
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        this.ItemPool = new cc.NodePool()
        for (let i = 0; i < 6; i++) {
            let item = cc.instantiate(this.itemPrefab)
            this.ItemPool.put(item)
        }
        let index = 1
        for(let j =0;j<6;j++){
            this.createItem(index++)
        }
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {
            if (this.firstFlag) {
                cc.audioEngine.play(RESSpriteFrame.instance.bgmAudioClip,false,1)
                cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
                this.firstFlag = false
                cc.tween(this.picNode)
                .to(0.2,{scale:1.2})
                .to(0.3,{scale:0})
                .call(()=>{
                    this.picNode.active = false
                    Utils.showUI(this.resultNode,RESSpriteFrame.instance.comeOutAudioClip,0.3,!this.firstFlag,()=>{
                        this.secondFlag = true
                        cc.audioEngine.play(RESSpriteFrame.instance.cherrUpAudioClip,false,1)
                    })
                }).start()
            }
            if(!this.firstFlag && this.secondFlag){
                this.cashoutFunc()
            }
        })
        this.picNode.active = true
        this.resultNode.active = false
        this.resize()
        let height = this.nodeBox.children[0].height
        cc.tween(this.nodeBox)
            .to(2, { y: height })
            .call(() => {
                this.updateItem(1)
                this.playTween()
            })
            .start()
    }
    private playTween(){
        let height = this.nodeBox.children[0].height;
        cc.tween(this.nodeBox)
            .to(2, { y: height })
            .call(() => {
                this.index++
                if(this.index > 6)this.index = 1
                this.updateItem(this.index);
                this.playTween();
            })
            .start();
    }
    private updateItem(index:number) {
        let height = this.nodeBox.children[0].height
        if (this.nodeBox.y >= height) {
            let item = this.nodeBox.children[0]
            this.nodeBox.removeChild(item)
            this.itemArr.splice(0, 1)
            this.createItem(index)
            this.nodeBox.y = 0
        }
    }
    private createItem(j?:number) {
        let item = null
        if(this.ItemPool.size()>0){
            item = this.ItemPool.get()
        }else{
            item = cc.instantiate(this.itemPrefab)
        }
        if(j==null)j=Utils.getRandomInt(1,6)
        item = item.getComponent(CommentItem)
        item.initItem(j)
        item.node.parent = this.nodeBox
        this.itemArr.push(item)
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        this.bgNode.getComponent(cc.Sprite).spriteFrame = cc.winSize.height > 1300 ?  this.bgArr[0] : this.bgArr[1]
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
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
}   
