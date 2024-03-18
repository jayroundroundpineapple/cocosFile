
const { ccclass, property } = cc._decorator;

@ccclass
export default class RESSpriteFrame extends cc.Component {
    public static instance: RESSpriteFrame;

    //声音
    @property({ type: cc.AudioClip })
    public ClickAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public BgmAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public GetMoneyAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public comeOutAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public cherrUpAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public DownLoadAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public StartAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public GetRewardAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public TurnAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public clearAudioClip: cc.AudioClip = null;
    start() {
        RESSpriteFrame.instance = this;
    }
}
