
const { ccclass, property } = cc._decorator;

@ccclass
export default class RESSpriteFrame extends cc.Component {
    public static instance: RESSpriteFrame;

    //声音
    @property({ type: cc.AudioClip })
    public clickAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public bgmAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public numberAddAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public comeOutAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public cherrUpAudioClip: cc.AudioClip = null;
    @property({ type: cc.AudioClip })
    public clearAudioClip: cc.AudioClip = null;
    start() {
        RESSpriteFrame.instance = this;
    }
}
