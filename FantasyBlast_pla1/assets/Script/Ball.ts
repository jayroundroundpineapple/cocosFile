
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
export default class Ball extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private system: cc.Node = null
    @property(cc.Label)
    private ballLabel: cc.Label = null

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
    public initItem(BallId: number, SpriteIndex: number, pos: cc.Vec2, isEmpty: boolean, cb: Function) {
        this.node.name = `${BallId}`
        this.node.scale = 0.7
        this.ballLabel.string = `${BallId}`
        this._BallId = BallId
        this.system.active = false
        cc.loader.loadRes(`/ui/item/${SpriteIndex}`, cc.SpriteFrame, (error, res) => {
            if (error) return
            this.itemNode.getComponent(cc.Sprite).spriteFrame = res
            if (SpriteIndex == ItemType.orange) {
                this.setLight()
            }
            cb()
        })
        this.node.setPosition(pos)
        this.schedule(this.judgeStop, 1, cc.macro.REPEAT_FOREVER, 0)
    }
    public setLight() {
        this.tween1 = cc.tween(this.node.children[0])
            .repeatForever(
                cc.tween()
                    .to(.6, { scale: 1.2, opacity: 255 })
                    .to(.6, { scale: 1, opacity: 50 })
            )
        this.tween1.start()
    }
/** * // 假设你有一个需要检测碰撞的节点 node
// 在 onLoad 或者其他合适的地方启用物理检测
 cc.director.getPhysicsManager().enabled = true;
// 在 update 方法或者其他定时更新的方法中更新物理世界
cc.director.getPhysicsManager().update();
// 发射一条从 node 节点的中心向下的射线
// 检测 node 节点下方是否有其他物理节点
let rayStart = node.position; // 射线起点
let rayEnd = cc.v2(rayStart.x, rayStart.y - 100); // 射线终点，比如100单位下方
let result = cc.director.getPhysicsManager().rayCast(rayStart, rayEnd, cc.RayCastType.Closest);
if (result.collider) {
    // 发生了碰撞，result.collider 是碰撞到的那个节点的物理碰撞体
    console.log("Node collided with: ", result.collider.node.name);
}
     */
    onBeginContact(contact, selfCollider, otherCollider) {
        // 当有接触开始时调用
        if (this.ballPhysisc.linearVelocity.mag() < 0.1) {
           let rayStart = cc.v2(this.node.position)
           let rayEnd = cc.v2(rayStart.x,rayStart.y+10*this.BallRaduis)
           let result = cc.director.getPhysicsManager().rayCast(rayStart,rayEnd,cc.RayCastType.Closest)
           console.log(result);
        }
        if (this.isBodyStill(this.ballPhysisc)) {
            this._isStop = true
        }
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
}

