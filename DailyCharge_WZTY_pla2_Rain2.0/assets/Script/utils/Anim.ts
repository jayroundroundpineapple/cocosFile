import Utils from "./Utils";

export default class Anim {
    public static _instance: Anim;

    public static ins(): Anim {
        if (!Anim._instance) {
            Anim._instance = new Anim();
        }
        return Anim._instance;
    }

    private prefab: cc.Prefab[];

    /**最大数量 */
    private maxNum: number = 40;
    private count: number = 0;
    private _staLen: number = 0;

    private _fun: Function;
    private _thisObj: any;


    /**
     * 播放飞的动画
     * @param len 数量
     * @param endPoint 飞到的位置
     * @param comFun 执行结束
     * @param thisObj this指向
     */
    public ShowFlyAni(prefab: cc.Prefab, parent, len: number, endPoint: cc.Vec2, comFun: Function = null, thisObj: any = null) {
        this.count = 0;
        this._staLen = len;
        this._fun = comFun;
        this._thisObj = thisObj;

        let halfX: number = 0;
        let halfY: number = 0;
        let X, Y, showMS, delay;

        for (var i = 0; i < len; i++) {
            var img: cc.Node = cc.instantiate(prefab);
            let sprite: cc.Sprite = img.getComponent(cc.Sprite)
            img.parent = parent;
            img.opacity = 255;
            img.x = halfX;
            img.y = halfY;

            if (cc.winSize.width > cc.winSize.height) {
                img.scale = Utils.limit(1.4, 1.9);
            } else {
                img.scale = Utils.limit(0.7, 0.95);
            }
            img.scale = 1;

            // //加载标题
            // cc.loader.loadRes(`common/moneyIcon`, cc.SpriteFrame, function (err, spriteFrame) {
            //     // cc.loader.loadRes(`common/usdIcon${Utils.limitInteger(0, 3)}`, cc.SpriteFrame, function (err, spriteFrame) {
            //     if (err) return;
            //     sprite.spriteFrame = spriteFrame;
            // });
            delay = 0.08 + i * 0.02;
            showMS = Utils.getRadian(Utils.limit(0, 18) * 20);
            X = halfX + Math.cos(showMS) * Utils.limit(8, 25) * 10;
            Y = halfY + Math.sin(showMS) * Utils.limit(8, 25) * 6;

            cc.tween(img).delay(delay).to(0.2 + delay,
                { x: X + Utils.limit(-10, 10), y: Y + Utils.limit(-2, 4) }, { easing: 'backOut' })
                .delay(0.05).to(0.3, { x: endPoint.x, y: endPoint.y })
                .to(0.2, { opacity: 0 })
                .call((than, target) => {
                    this.onEffectComplete(target)
                }, this, img).start();
        }

    }

    private onEffectComplete(img: cc.Node): void {
        if (img && img.parent) {
            img.destroy();;
            this.count++;
            // Sound.ins().playaddCoin();
            // Sound.ins().playsound_usd();
            cc.loader.loadRes(`music/addCoin`, cc.AudioClip, function (err, AudioClip) {
                if (err) return;

                cc.audioEngine.play(AudioClip, false, 1)
            });


            if (this.count == this._staLen) {
                if (this._fun != null) {
                    this._fun.call(this._thisObj);
                    this._fun = null;
                    this._thisObj = null;
                }
            }
        }
    }

}