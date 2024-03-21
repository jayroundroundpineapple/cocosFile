import RESSpriteFrame from "./RESSpriteFrame";

const { ccclass, property } = cc._decorator;

export const enum ItemType {
    pink = 1,
    red = 2,
    blue = 3,
    purple = 4,
    orange = 5,
    green = 6
}
@ccclass
export default class HorBall extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private system: cc.Node = null
    @property(cc.Label)
    private ballLabel: cc.Label = null

    private _spriteIndex:number = null
    private _canClear:boolean = false
    private BallRaduis:number = 54
    private _isStop: boolean = false
    private ballPhysisc;
    private collider;
    private tween1: any = null
    private _BallId: number = null
    protected onLoad(): void {
        this.ballPhysisc = this.node.getComponent(cc.RigidBody)
        this.collider = this.node.getComponent(cc.PhysicsCollider)
    }
    public initItem(BallId: number, SpriteIndex: number, pos: cc.Vec2,cb: Function) {
        this.node.name = `${BallId}`
        this._spriteIndex = SpriteIndex
        this.node.scale = 1
        this.ballLabel.string = `${BallId}`
        this._BallId = BallId
        this.system.active = false
        cc.loader.loadRes(`/ui/item/${SpriteIndex}`, cc.SpriteFrame, (error, res) => {
            if (error) return
            this.itemNode.getComponent(cc.Sprite).spriteFrame = res
            cb()
        })
        this.node.setPosition(pos)
        this.schedule(this.judgeStop, .1, cc.macro.REPEAT_FOREVER, 0)
    }
    private bindClickEvent(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.clickFunc,this)
    }
    private clickFunc(){
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
        this.node.emit('HorClearEvent',this)
    }
    public setLight() {
        this.tween1 = cc.tween(this.node)
            .repeatForever(
                cc.tween()
                    .to(.6, { scale: 1, opacity: 50 })
                    .to(.6, { scale: 1, opacity: 255 })
            )
        this.tween1.start()
    }
    private clearNode(){
        this.itemNode.getComponent(cc.Sprite).spriteFrame = null
        this.system.active = true
        this.node.destroy()
    }
    onBeginContact(contact, selfCollider, otherCollider) {
        // 当有接触开始时调用
        // if (this.ballPhysisc.linearVelocity.mag() < 0.1) {
        //    let rayStart = cc.v2(this.node.position)
        //    let rayEnd = cc.v2(rayStart.x,rayStart.y+10*this.BallRaduis)
        //    let result = cc.director.getPhysicsManager().rayCast(rayStart,rayEnd,cc.RayCastType.Closest)
        //    console.log(result);
        // }
        // if (this.isBodyStill(this.ballPhysisc)) {
        //     this._isStop = true
        // }
    }
    private judgeStop() {
        if (this.isBodyStill(this.ballPhysisc)) {
            this._isStop = true
            this.unschedule(this.judgeStop)
        }
    }
    onEndContact(contact, selfCollider, otherCollider) {
        // 当有接触结束时调用
    }

    // 注意：这里假设物体静止是指它没有速度或者角速度
    isBodyStill(body) {
        return body.linearVelocity.mag() <= 1e-6 && body.angularVelocity <= 1e-6;
    }
    set BallId(BallId: number) {
        this._BallId = BallId
    }
    get BallId() {
        return this._BallId
    }
    set isStop(flag: boolean) {
        this._isStop = flag
    }
    get isStop() {
        return this._isStop
    }
    set canClear(flag:boolean){
        this._canClear = flag
    }
    get canClear(){
        return this._canClear
    }
    set spriteIndex(index:number){
        this._spriteIndex = index
    }
    get spriteIndex(){
        return this._spriteIndex
    }
}

