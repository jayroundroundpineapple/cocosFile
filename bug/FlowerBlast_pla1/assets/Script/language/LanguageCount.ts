import { LanguageManager } from "./LanguageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class LanguageCount extends cc.Component {

    @property(cc.Integer)
    languageNum: number = 0;

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
        this.lable.string = `${mgr.formatUnit(this.languageNum)}`;
    }
}
