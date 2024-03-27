import RESSpriteFrame from "./RESSpriteFrame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    
    private ballPhysisc;  //小球刚体组件
    protected onLoad(): void {
        this.ballPhysisc = this.node.getComponent(cc.RigidBody)
    }
    protected start(): void {
        // rigidbody.enabledContactListener = true;
        let collider = this.node.getComponent(cc.CircleCollider)
        let rigidBody = this.node.getComponent(cc.RigidBody)
        rigidBody.enabledContactListener = true
    }
    public initItem(){
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
        let isAuto = false
        if(otherCollider.node.group == 'bottombox'){
            if(selftCollider.tag == 1)isAuto = true
            this.node.emit('ShootInBox',otherCollider.tag,isAuto)
            cc.audioEngine.play(RESSpriteFrame.instance.ShootInAudioClip,false,3)
            this.node.destroy()
        }
    }
    protected onDisable(): void {
    }
}

