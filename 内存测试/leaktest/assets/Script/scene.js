// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        s: cc.Sprite,
        s1: cc.Sprite,
        s2: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    load() {
        cc.loader.loadRes("a", cc.SpriteFrame, function (err, spriteFrame) {
            this.s.spriteFrame = spriteFrame
        }.bind(this));
        cc.loader.loadRes("b", cc.SpriteFrame, function (err, spriteFrame) {
            this.s1.spriteFrame = spriteFrame
        }.bind(this));
        cc.loader.loadRes("c", cc.SpriteFrame, function (err, spriteFrame) {
            this.s2.spriteFrame = spriteFrame
        }.bind(this));
    },
    release() {
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {

            var deps = cc.loader.getDependsRecursively(this.s.spriteFrame);
            this.s.spriteFrame = null;
            cc.loader.release(deps);

            var deps = cc.loader.getDependsRecursively(this.s1.spriteFrame);
            this.s1.spriteFrame = null;
            cc.loader.release(deps);

            var deps = cc.loader.getDependsRecursively(this.s2.spriteFrame);
            this.s2.spriteFrame = null;
            cc.loader.release(deps);

            cc.sys.garbageCollect();
        }.bind(this))
    },
    gc() {
        cc.sys.garbageCollect();
    },
    onClick() {
        cc.director.loadScene("Scene/scene0")
    }
    // update (dt) {},
});
