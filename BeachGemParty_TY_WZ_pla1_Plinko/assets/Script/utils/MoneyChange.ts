/**
 * 文本动态变化类
 */
export default class MoneyChange {
    /**绑定的文本 */
    public lable: cc.Label;
    /**数量 */
    public _count: number;
    public name: string;
    isValid: boolean;
    /**金币前缀 */
    private _prefix: string = "";
    private decimal: boolean = false;

    public maxCount: number;
    public constructor(lable: cc.Label, decimal: boolean = false, count = 0) {
        this.lable = lable;
        this._count = count;
        this.decimal = decimal;
    }

    public setData(maxCount: number): void {
        this.maxCount = maxCount;
    }


    public get num(): number {
        return 0;
    }

    /**
     * 动态设置金币增长
     */
    public set num(value: number) {
        if (!this.lable) {
            return;
        }

        let cha: number = this.maxCount - this._count;
        let num: number = Math.floor(cha * value);
        this.lable.string = this._prefix + (this._count + num) + (this.decimal ? ".00" : "");
        if (value == 1) {
            this._count = this.maxCount;
        }
    }

    /**设置前缀 */
    public set prefix(string: string) {
        if (string) {
            this._prefix = string;
        }
    }

    public get prefix(): string {
        return this._prefix;
    }

    set count(num:number){
        this._count = num
    }
    get count(){
        return this._count
    }

    private tween: cc.Tween;
    /**播放金币增长动画 */
    public play(count: number, time: number, callBack?: Function, thisObj?: any) {
        this.maxCount = count;
        if (this.tween) {
            this.tween.stop();
        }
        this.tween = cc.tween(this).to(time, { num: 1 }).start();
        setTimeout(() => {
            callBack && callBack()
        }, time * 1000)
    }

    /**销毁 */
    public destroy(): boolean {
        if (this.tween) {
            this.tween.stop();
        }
        this.lable = null;
        this._count = null;
        this.maxCount = null;
        return
    }

}