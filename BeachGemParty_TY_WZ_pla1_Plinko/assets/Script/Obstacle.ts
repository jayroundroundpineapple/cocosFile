import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Obstacle extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Label)
    private coinLabel:cc.Label = null;

    private tlickId:number = null
    private ballPhysisc;  //障碍刚体组件
    protected onLoad(): void {
       
    }
    protected start(): void {
        // rigidbody.enabledContactListener = true;
        this.coinLabel.node.active = false
        let unit = LanguageManager.instance.getText(10001)
        let randomNum = Utils.getRandomInt(1,3)
        randomNum = LanguageManager.instance.formatUnit(randomNum)
        this.coinLabel.string = `+${unit}${randomNum}`
        let collider = this.node.getComponent(cc.CircleCollider)
        let rigidBody = this.node.getComponent(cc.RigidBody)
        rigidBody.enabledContactListener = true
    }
    public initItem(){
        this.coinLabel.node.active = false
        this.ballPhysisc = this.node.getComponent(cc.RigidBody)
        this.ballPhysisc.linearVelocity = cc.v2(this.getRandomInt(-1500,1500),this.getRandomInt(-1500,-500))
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    onCollisionEnter(other, self) {
        console.log('Collision Enter: 111');
    }

    onCollisionStay(other, self) {
        console.log('Collision Stay: 111');
    }
    onCollisionExit(other, self) {
        console.log('Collision Exit: 111');
    }
    /**?
     * 碰撞监听
     */
    onBeginContact(contact,selftCollider,otherCollider){
        if(this.tlickId!=null){
            cc.audioEngine.pause(this.tlickId)
        }
        this.tlickId = cc.audioEngine.play(RESSpriteFrame.instance.TlickAudioClip,false,1)
        cc.tween(this.node)
        .to(.15,{scale:1.2})
        .to(.15,{scale:1})
        .start()
        this.coinLabel.node.active = true
        cc.tween(this.coinLabel.node)
        .to(.4,{y:20},{easing:'quadOut'})
        .call(()=>{
            this.coinLabel.node.y = 0
            this.coinLabel.node.active = false
            let unit = LanguageManager.instance.getText(10001)
            let monNum = Utils.getRandomInt(1,3)
            monNum = LanguageManager.instance.formatUnit(monNum)
            this.coinLabel.string = `+${unit}${monNum}`
            this.node.emit('AddMoney',monNum,this)
        }).start()
    }
    protected onDisable(): void {
    }
}

