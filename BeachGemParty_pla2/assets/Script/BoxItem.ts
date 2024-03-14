
const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxItem extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    @property(cc.Node)
    private system:cc.Node = null

    private _row:number = null
    private _colmun:number = null
    private _isEmpty:boolean = false
    private _id:number = null
    private _spriteIndex:number = null;
    public initItem(id:number,SpriteIndex:number,pos:cc.Vec2,isEmpty:boolean,cb:Function){
        this.system.active = false
        cc.loader.loadRes(`/item/${SpriteIndex}`,cc.SpriteFrame,(error,res)=>{
            if(error)return
            this.itemNode.getComponent(cc.Sprite).spriteFrame = res
            this._id = id
            this._isEmpty = isEmpty
            this._spriteIndex = SpriteIndex
            this._row = Math.floor(id  / 7) + 1
            this._colmun = (id % 7) + 1
            cb()
        })
        this.node.setPosition(pos)
    }
    public setClear(){
        this.itemNode.getComponent(cc.Sprite).spriteFrame = null
        this.system.active = true
    }
    public setLight(){
        let tween1 = cc.tween(this.itemNode)
        .repeatForever(
            cc.tween()
            .to(.5,{opacity:100})
            .to(.5,{opacity:255})
        )
        tween1.start()
    }

    protected onDisable(): void {
    }
    set id(id:number){
        this._id = id
    }
    get id(){
        return this._id
    }
    set spriteIndex(index:number){
        this._spriteIndex = index
    }
    get spriteIndex(){
        return this._spriteIndex
    }
    set isEmpty(flag:boolean){
        this._isEmpty = flag
    }
    get isEmpty(){
        return this._isEmpty
    }
    set row(row:number){
        this._row = row
    }
    get row(){
        return this._row
    }
    set colmun(colmun:number){
        this._colmun = colmun
    }
    get colmun(){
        return this._colmun
    }
}

