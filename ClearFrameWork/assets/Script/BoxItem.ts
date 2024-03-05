import { Direction } from "./CommonMacro";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxItem extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private ClearSystem:cc.Node = null;

    private _id:number;
    private _x: number = null;
    private _y: number = null;
    private originZindex: number = null
    private raduis: number = 50
    private _originPos: cc.Vec3 = null
    //设置消除的行和列数
    private _row: number = null
    private _colmun: number = null
    private gameRow: number = 5;
    private gameColmun: number = 6;
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
    public setClear(flag:boolean,callback:Function){
        if(flag){
            this.ClearSystem.active = flag
            setTimeout(() => {
                callback()
            }, 300);
        }
    }
    public initItem(index: number, randonIndex: number, pos: cc.Vec3, callback?: Function) {
        cc.resources.load(`ui/icon/${randonIndex}`, cc.SpriteFrame, (err, spriteFrame) => {
            this.itemNode.getComponent(cc.Sprite).spriteFrame = spriteFrame
            this.itemNode.position = pos
            this._x = pos.x
            this._y = pos.y
            this._id = randonIndex
            this._originPos = pos
            this.itemNode.name = `item${index}`
            this._row = Math.floor(index / this.gameColmun) + 1  //第n行
            this._colmun = (index % this.gameColmun) + 1
            this.itemNode.on(cc.Node.EventType.TOUCH_START, this.onMouseHandler, this)
            callback && callback()
        })
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
        this.itemNode.zIndex = this.originZindex
        let node = evt.target
        let touchPos = evt.getLocation()
        let startPos = evt.getStartLocation()
        let offset = touchPos.sub(startPos)
        let disX: number = Math.abs(offset.x)
        let disY: number = Math.abs(offset.y)
        let dirLeftX: boolean = offset.x > 0 ? true : false
        let dirTopY: boolean = offset.y > 0 ? true : false
        if (this._row != 1 && Math.abs(offset.x) < this.itemNode.width / 3 && Math.abs(offset.y) > this.itemNode.height / 3 && Math.abs(offset.y) < 2 * this.itemNode.height && dirTopY) {
            console.log('上移');
            this.node.emit('changePositon', this, this._row, this._colmun,Direction.UP)
        }
        else if (this._row != this.gameRow && Math.abs(offset.x) < this.itemNode.width / 3 && Math.abs(offset.y) > this.itemNode.height / 3 && !dirTopY) {
            console.log('下移');
            this.node.emit('changePositon', this, this._row, this._colmun,Direction.BOTTOM)
        }
        else if (this._colmun != this.gameColmun && dirLeftX && Math.abs(offset.x) > this.itemNode.width / 3 && Math.abs(offset.y) < this.itemNode.width / 3) {
            console.log('右移');
            this.node.emit('changePositon', this, this._row, this._colmun,Direction.RIGHT)
        }
        else if (this._colmun != 1 && !dirLeftX && Math.abs(offset.x) > this.itemNode.width / 3 && Math.abs(offset.y) < this.itemNode.width / 3) {
            console.log('左移');
            this.node.emit('changePositon', this, this._row, this._colmun,Direction.LEFT)
        }
        else {
            this._x = this._originPos.x
            this._y = this._originPos.y
            cc.tween(this.itemNode).delay(0.05)
                .to(0.3, { x: this._originPos.x, y: this._originPos.y }, { easing: 'quadOut' })
                .start()
            console.log('归位');
        }
    }
    private TouchMoveHandler(evt: cc.Event.EventTouch) {
        this.itemNode.zIndex = 99
        let node = evt.target
        let touchPos = node.convertToNodeSpaceAR(evt.getLocation())
        let startPos = node.convertToNodeSpaceAR(evt.getStartLocation())
        let offset = touchPos.sub(startPos)
        if (offset.mag() > this.raduis) {
            let normal = offset.normalizeSelf()
            this.itemNode.x = normal.x * this.raduis + this._originPos.x
            this.itemNode.y = normal.y * this.raduis + this._originPos.y
        } else {
            let x = this._originPos.x + offset.x
            let y = this._originPos.y + offset.y
            this.itemNode.x = x
            this.itemNode.y = y
        }
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
    set originPosX(x:number){
        this._originPos.x = x
    }
    get originPosX(){
        return this._originPos.x
    }
    set originPosY(y:number){
        this._originPos.y = y
    }
    get originPosY(){
        return this._originPos.y
    }
    set id(id:number){
        this._id = id
    }
    get id(){
        return this._id
    }
    protected onDisable(): void {

    }
}

