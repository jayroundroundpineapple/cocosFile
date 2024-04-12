
const { ccclass, property } = cc._decorator;

@ccclass
export default class Ball extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    
    private _cubeId:number = null; //所在的试管号
    private _BallSpriteId:number = null; //球Id
    private _BallId:number = null; //球在试管的索引
    private _IsUp:boolean = false  //小球是否已升起
    public initItem(BallSpriteId:number,posX:number,posY:number,cubeId:number,BallId:number){
        cc.loader.loadRes(`ui/item/${BallSpriteId}`,cc.SpriteFrame,(err,res)=>{
            if(err)return;
            this._BallSpriteId = BallSpriteId 
            this._BallId = BallId
            this._cubeId  = cubeId
            this.itemNode.getComponent(cc.Sprite).spriteFrame = res
            this.itemNode.scale = 1
            this.itemNode.x = posX
            this.itemNode.y = posY
            this.itemNode.scale = 1
        })
    }

    set cubeId(num:number){
        this._cubeId = num
    }
    get cubeId(){
        return this._cubeId
    }
    set BallSpriteId(index:number){
        this._BallSpriteId = index
    }
    get BallSpriteId(){
        return this._BallSpriteId
    }
    set BallId(id:number){
        this._BallId = id
    }
    get BallId(){
        return this._BallId
    }
    set isUp(flag:boolean){
        this._IsUp = flag
    }
    get isUp(){
        return  this._IsUp
    }
}

