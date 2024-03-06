import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinItem extends cc.Component {
    @property(cc.Node)
    private tailNode:cc.Node = null
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private streak:cc.Node = null
    game: any = null;
    public initItem() {
        this.itemNode.on(cc.Node.EventType.TOUCH_START, this.onclickFunc, this)
        if(cc.winSize.width > cc.winSize.height){
            this.itemNode.parent.scale = 1.6
        }
    }
    public updateSize(){
        if(cc.winSize.width > cc.winSize.height){
            this.itemNode.parent.scale = 1.6
            this.tailNode.getComponent(cc.MotionStreak).stroke = 223
        }else{
            this.itemNode.parent.scale = 1
        }
    }
    public setSteak(flag:boolean){
        this.streak.active = flag
    }
    public setTail(time:number){
        cc.tween(this.tailNode)
        .to(time,{opacity:0})
        .start()
    }
    private onclickFunc() {
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
        this.itemNode.off(cc.Node.EventType.TOUCH_START)
        cc.tween(this.itemNode)
            .to(0.05,{scale:1.2})   
            .to(0.1, { scale: 0})
            .call(() => {
                EffectUtils.removeTweens(this.itemNode);
                this.game.addScore()
                this.streak.active = this.tailNode.active = false
                this.game.redItemPool.put(this.node)
            }).start()
    }
    protected onDisable(): void {
        this.itemNode.off(cc.Node.EventType.TOUCH_START, this.onclickFunc, this)
    }
}
export class coinEvent {
    /**红包点击事件 */
    public static readonly REDITEM_ONCLICK = "REDITEM_ONCLICK"
}
