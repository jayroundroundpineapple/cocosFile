import { BoxManager } from "./box/BoxManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxItem extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private ClearSystem: cc.Node = null;

    private _isEmpty:boolean = false
    private _id: number;
    private _x: number = null;
    private _y: number = null;
    private originZindex: number = null
    private raduis: number = 50
    private _originPos: cc.Vec3 = null
    //设置消除的行和列数
    private _row: number = null
    private _colmun: number = null
    private gameRow: number = 9;
    private gameColmun: number = 9;
    private _gap:number = 0
    start() {
        //this.resize()
        this.originZindex = this.itemNode.zIndex
        this.ClearSystem.active = false
        this.itemNode.on(cc.Node.EventType.TOUCH_END,this.OnclickFunc,this)
    }
    public resize() {
        let isVerTical = cc.winSize.height > cc.winSize.width
        if (this.itemNode == null) {
            return
        } else {
            this.itemNode.x = isVerTical ? 0 : -cc.winSize.width / 3.5
        }
    }
    private OnclickFunc(){
        this.itemNode.emit('OnFirstClickEvent',this)
        // cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip,false,1)
        this.itemNode.emit('sendClickEvent',this)
    }
    public setSprite(){
        let index = Utils.getRandomInt(1,6)
        if(index==3)index = Utils.getRandomInt(4,6)
        cc.resources.load(`ui/block/${index}`,cc.SpriteFrame,(err,spriteFrame)=>{
            this.itemNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
    }
    public setClear(flag: boolean, callback: Function) {
        if (flag) {
            this.ClearSystem.active = flag
            this.itemNode.getComponent(cc.Sprite).spriteFrame = null
            setTimeout(() => {
                callback()
            }, 300);
        }
    }
    public initItem(index: number, spriteIndex: number, pos: cc.Vec3,isEmpty:boolean,gap:number,callback?: Function) {
        cc.resources.load(`ui/block/${spriteIndex}`, cc.SpriteFrame, (err, spriteFrame) => {
            this.itemNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
            this.itemNode.position = pos
            this._x = pos.x
            this._y = pos.y
            this._gap = gap
            this._isEmpty = isEmpty
            this._id = index
            this._originPos = pos
            this.itemNode.name = `item${index}`
            this._row = Math.floor(index / this.gameColmun)  //第n行
            this._colmun = (index % this.gameColmun)
            callback && callback()
        })
    }
    public setPostionY(y:number){
        this.itemNode.y = y
    }
    public changePos(pos: cc.Vec3) {
        cc.tween(this.itemNode)
            .to(0.2, { position: pos }, { easing: 'quadOut' })
            .start()
    }
    set row(index: number) {
        this._row = index
    }
    get row() {
        return this._row
    }
    set colmun(index: number) {
        this._colmun = index
    }
    get colmun() {
        return this._colmun
    }
    set x(x: number) {
        this._x = x
    }
    get x() {
        return this._x
    }
    set y(y: number) {
        this._y = y
    }
    get y() {
        return this._y
    }
    set originPosX(x: number) {
        this._originPos.x = x
    }
    get originPosX() {
        return this._originPos.x
    }
    set originPosY(y: number) {
        this._originPos.y = y
    }
    get originPosY() {
        return this._originPos.y
    }
    set id(id: number) {
        this._id = id
    }
    get id() {
        return this._id
    }
    set isEmpty(flag:boolean){
        this._isEmpty = flag
    }
    get isEmpty(){
        return this._isEmpty
    }
    set gap(gap:number){
        this._gap = gap
    }
    get gap(){
        return this._gap
    }
    protected onDisable(): void {

    }
}

