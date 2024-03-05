
const { ccclass, property } = cc._decorator;

@ccclass
export default class RESSpriteFrame extends cc.Component {
    public static instance: RESSpriteFrame;

    //声音
    @property({ type: cc.AudioClip })
    public clickClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public ClearClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public numberAddClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public comeOutClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public cherrUpClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public NumberUpClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public CoinFlyClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public WowClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public GreatClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public unBelieveClip: cc.AudioClip = null;
    start() {
        RESSpriteFrame.instance = this;
    }
}
