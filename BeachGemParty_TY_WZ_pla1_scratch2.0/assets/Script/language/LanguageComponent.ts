import { LanguageManager } from "./LanguageManager";

const {ccclass, property} = cc._decorator;

@ccclass
export class LanguageComponent extends cc.Component {

    @property(cc.Integer)
    languageId: number = 0;

    private lable: cc.Label | cc.RichText = null;
    private formatArgs: any[] = null;

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

        if (this.formatArgs != null) {
            let content = mgr.getText(this.languageId);
            this.lable.string = content.format(...this.formatArgs);
        } else {
            this.lable.string = mgr.getText(this.languageId);
        }
    }

    public ChangeNormalId(textId: number, ...args: any[]): void {
        this.languageId = textId;
        if (args.length <= 0) {
            this.formatArgs = null;
        } else {
            this.formatArgs = args;
        }

        this.ChangeLanguage();
    }

    public SetFormatText(...args: any[]): void {
        this.formatArgs = args;
        this.ChangeLanguage();
    }
}
