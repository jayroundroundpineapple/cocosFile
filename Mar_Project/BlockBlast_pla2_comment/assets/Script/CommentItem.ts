import { LanguageComponent } from "./language/LanguageComponent";
import { LanguageManager } from "./language/LanguageManager";
import Utils from "./utils/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CommentItem extends cc.Component {
    @property(cc.Node)
    private headNode: cc.Node = null;
    @property(cc.Label)
    private agreeLabel:cc.Label = null
    @property(cc.Label)
    private nameLabel:cc.Label = null
    @property(cc.Label)
    private content:cc.Label = null;
    @property(cc.Label)
    private timelabel:cc.Label = null;
    start(){
       
    }
    public initItem(i:number){
        let index = i
        cc.loader.loadRes(`/ui/head/${index}`,cc.SpriteFrame,(err,res)=>{
            if(err)return;
            this.headNode.getComponent(cc.Sprite).spriteFrame = res
        })
        let number = Utils.getRandomInt(0,300)
        this.agreeLabel.string = `${number}`
        let id = index - 1
        let nameArr = ['Kayla','David','Leah','Rosie','Yoko','Yan']
        this.nameLabel.string = `${nameArr[id]}`
        let idArr = [10003,10004,10005,10006,10007,10008]
        this.content.string = LanguageManager.instance.getText(idArr[id])
        this.timelabel.string = `${Utils.getRandomInt(2,9)} ${LanguageManager.instance.getText(10009)}`
    }
    protected onDisable(): void {

    }
}

