import { Direction } from "./CommonMacro";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxItem extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private ClearSystem: cc.Node = null;

    private _FirstCanClick:boolean = false
    private BoxData: any = null
    private _BoxId:number = null
    private _SpriteId: number;
    private _x: number = null;
    private _y: number = null;
    private originZindex: number = null
    private raduis: number = 50
    private _originPos: cc.Vec3 = null
    //设置消除的行和列数
    private _row: number = null
    private _colmun: number = null
    private gameRow: number = 8;
    private gameColmun: number = 8;
    start() {
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        // cc.view.setResizeCallback(() => {
        //     that.resize();
        // })
        this.originZindex = this.itemNode.zIndex
        this.ClearSystem.active = false
    }
    public resize() {
        let isVerTical = cc.winSize.height > cc.winSize.width
        if (this.itemNode == null) {
            return
        } else {
            this.itemNode.x = isVerTical ? 0 : -cc.winSize.width / 3.5
        }
    }
    public setClear(flag: boolean, callback: Function) {
        if (flag) {
            this.ClearSystem.active = flag
            setTimeout(() => {
                callback()
            }, 300);
        }
    }
    public initItem(index: number, BoxData: any, pos: cc.Vec3, callback?: Function):Promise<void> {
        return new Promise((resolve, reject) => {
            cc.resources.load(`ui/icon/${BoxData.spriteIndex}`, cc.SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    reject(err)
                } else {
                    this._BoxId = index
                    this._FirstCanClick = BoxData.FirstCanClick
                    this.itemNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
                    this.itemNode.position = pos
                    this.BoxData = BoxData
                    this.itemNode.scale = 0.83
                    this._x = pos.x
                    this._y = pos.y
                    this._SpriteId = BoxData.spriteIndex
                    this._originPos = pos
                    this.itemNode.name = `item${index}`
                    this._row = Math.floor(index / this.gameColmun) + 1  //第n行
                    this._colmun = (index % this.gameColmun) + 1
                    // if (BoxData.FirstCanClick) {
                    //     this.setOnLight()
                    // }
                    this.itemNode.on(cc.Node.EventType.TOUCH_START, this.onMouseHandler, this)
                    callback && callback()
                    console.log('jayrow-colmun',this._row,this._colmun);
                    resolve()
                }
            })
        })
    }
    public setOnLight() {
        cc.tween(this.node).repeatForever(
            cc.tween(this.node)
                .to(0.3, { opacity: 100 })
                .to(0.3, { opacity: 255 })
                .start()
        ).start()
    }
    public changePos(pos: cc.Vec3) {
        cc.tween(this.itemNode)
            .to(0.2, { position: pos }, { easing: 'quadOut' })
            .start()
    }
    private onMouseHandler() {
        this.itemNode.on(cc.Node.EventType.TOUCH_CANCEL, this.TouchEndHandler, this)
        this.itemNode.on(cc.Node.EventType.TOUCH_END, this.TouchEndHandler, this)
        this.itemNode.on(cc.Node.EventType.TOUCH_MOVE, this.TouchMoveHandler, this)
    }
    private TouchEndHandler(evt: cc.Event.EventTouch) {

    }
    private TouchMoveHandler(evt: cc.Event.EventTouch) {

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
    set SpriteId(index: number) {
        this._SpriteId = index
    }
    get SpriteId() {
        return this._SpriteId
    }
    set BoxId(id:number){
        this._BoxId = id
    }
    get BoxId(){
        return this._BoxId
    }
    set FirstCanClick(flag:any){
        this._FirstCanClick = Boolean(flag)
    }
    get FirstCanClick(){
        return this._FirstCanClick
    }
    protected onDisable(): void {

    }
}

