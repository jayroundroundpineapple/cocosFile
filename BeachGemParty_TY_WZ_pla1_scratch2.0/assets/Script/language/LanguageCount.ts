import { LanguageManager } from "./LanguageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class LanguageCount extends cc.Component {
    @property({type:cc.Boolean,tooltip:CC_DEV && '是否自动配置货币'})
    autoPrefix:boolean = true
    @property({type:cc.Boolean,tooltip:CC_DEV && '是否自动配置小数点'})
    autoNumfix:boolean = true
    @property({type:cc.Integer,tooltip:CC_DEV && '保留小数位数'})
    pointNum: number = 0;
    @property({type:cc.Boolean,tooltip:CC_DEV && '是否自动配置货币后缀'})
    autoEndfix:boolean = false
    @property({type:cc.Float,tooltip:CC_DEV && '数字'})
    languageNum: number = 0;
    @property({type:cc.String,tooltip:CC_DEV && '前缀'})
    prefix:string = ''
    @property({type:cc.String,tooltip:CC_DEV && '后缀'})
    endFix:string = ''
    private lable: cc.Label | cc.RichText = null;

    protected onLoad(): void {
        if (this.getComponent(cc.Label))
            this.lable = this.getComponent(cc.Label);
        else if (this.getComponent(cc.RichText))
            this.lable = this.getComponent(cc.RichText);
    }

    protected start(): void {
        this.ChangeLanguage();
    }

    protected onEnable(): void {
        this.ChangeLanguage();
    }

    private ChangeLanguage(): void {
        if (!this.lable)
            return;
        let mgr = LanguageManager.instance;
        let unit = mgr.getText(10001)
        let Num = this.autoNumfix ? `${mgr.formatUnit(this.languageNum)}` : `${mgr.formatUnit(this.languageNum).toFixed(this.pointNum)}`
        let contentNum = `${Num}`
        if(this.autoPrefix){
            contentNum = `${unit}${Num}`
        }
        this.lable.string = `${this.prefix}${contentNum}${this.endFix}`
        if(this.autoEndfix){
            this.lable.string = `${this.prefix}${contentNum}${this.endFix}${unit}`;
        }
    }
}
