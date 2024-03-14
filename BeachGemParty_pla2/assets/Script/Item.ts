
const { ccclass, property } = cc._decorator;

export const enum ItemType {
    pink = 1,
    yellow = 2,
    red = 3,
    blue = 4
}
@ccclass
export default class Item extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private system: cc.Node = null

    private tween1:any = null
    private _row: number = null
    private _colmun: number = null
    private _isEmpty: boolean = false
    private _idNum: number = null
    private _spriteIndex: number = null;
    public initItem(id: number, SpriteIndex: number, pos: cc.Vec2, isEmpty: boolean, cb: Function) {
        this.system.active = false
        cc.loader.loadRes(`/item/${SpriteIndex}`, cc.SpriteFrame, (error, res) => {
            if (error) return
            this.itemNode.getComponent(cc.Sprite).spriteFrame = res
            this._idNum = id
            this._isEmpty = isEmpty
            this._spriteIndex = SpriteIndex
            this._row = Math.floor(id / 7) + 1
            this._colmun = (id % 7) + 1
            if (SpriteIndex == ItemType.yellow) {
                this.setLight()
            }
            cb()
        })
        this.node.setPosition(pos)
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
    public setSystem(flag:boolean){
        this.system.active = flag
    }
    public setClear(time: number) {
        this.node.children[0].opacity = 220
        this.tween1.stop()
        setTimeout(() => {
            this.itemNode.getComponent(cc.Sprite).spriteFrame = null
            this.system.active = true
        },time*1000)
    }

    protected onDisable(): void {
    }
    set idNum(id: number) {
        this._idNum = id
    }
    get idNum() {
        return this._idNum
    }
    set spriteIndex(index: number) {
        this._spriteIndex = index
    }
    get spriteIndex() {
        return this._spriteIndex
    }
    set isEmpty(flag: boolean) {
        this._isEmpty = flag
    }
    get isEmpty() {
        return this._isEmpty
    }
    set row(row: number) {
        this._row = row
    }
    get row() {
        return this._row
    }
    set colmun(colmun: number) {
        this._colmun = colmun
    }
    get colmun() {
        return this._colmun
    }
}

