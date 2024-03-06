import { PayType } from "../sdk/PlayableSDK";
import { LanguageManager } from "./LanguageManager";
const { ccclass, property } = cc._decorator;

@ccclass
export class LanguageIcons extends cc.Component {

    @property({ type: cc.Boolean })
    public isFollowLanage: boolean = true;

    @property({ type: cc.String, displayName: CC_DEV && 'pay文件夹下的路径名,全部按语言缩写配置' })
    public srcName: string = ''

    @property({
        type: cc.Enum(PayType),
        visible: function () {
            return !this.isFollowLanage;
        }
    })
    public payType: PayType = PayType.One;
    private icon: cc.Sprite = null;

    onLoad() {
        this.icon = this.node.getComponent(cc.Sprite);
    }

    start() {
        this.initIcon();
    }

    private initIcon(): void {
        if (this.icon == null) return;
        let lang = ''
        if (cc.sys.language == 'zh') {
            lang = 'en'
        } else {
            lang = cc.sys.language
        }
        let cfg = this.isFollowLanage ? LanguageManager.instance.payAppInfo : LanguageManager.instance.getPayAppInfo(this.payType);
        let res = `${this.srcName}/${lang}`;

        cc.loader.loadRes(`/pay/${res}`, cc.SpriteFrame, (error, res) => {
            if (error) {
                console.log("error = ", error);
                return;
            }
            this.icon.spriteFrame = res;
        });
    }
}
