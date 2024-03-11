
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onClick() {
        this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            cc.director.loadScene("Scene/scene1")
        })))
    },

    start() {

    },

    gc() {
        cc.sys.garbageCollect();
    },

    // update (dt) {},
});
