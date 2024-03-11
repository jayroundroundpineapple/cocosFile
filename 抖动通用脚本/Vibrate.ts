const { ccclass, property } = cc._decorator;
@ccclass
export default class Vibrate extends cc.Component {
    //#region 单例模式

private static instance: MyCamera;

public static get Instance() {

    return this.instance;

}

onLoad(): void {

    MyCamera.instance = this;

}

//#endregion

//#region 变量

//是否正在震动

private isShake: boolean = false;

//#endregion

//#region 操作

/**

 * 伸缩节点达到类似震动屏幕的效果

 */

public TweenShake() {
    if (this.isShake) {
        return;
    }
    //设置抖动开关防止同时调用导致位移
    this.isShake = true;
    //抖动方法（可选择）
    this.Shake2();
}
/**

 * 抖动方法1（左右抖动）

 */
private Shake1() {
    new Tween(this.node)
        .by(0.05, { worldPosition: new Vec3(5, 5) })
        .by(0.05, { worldPosition: new Vec3(-10, -10) })
        .by(0.05, { worldPosition: new Vec3(5, 5) })
        .call(() => {
            this.isShake = false;
        })
        .start();
}
/**
 * 抖动方法2（伸缩抖动）
 */
public Shake2() {
    let camera: cc.Camera = this.getComponent(Camera);
    let ort: number = camera.orthoHeight;
    new Tween(camera)
        .to(0.05, { orthoHeight: ort + 5 })
        .to(0.05, { orthoHeight: ort - 5 })
        .to(0.05, { orthoHeight: ort })
        .call(() => {
            this.isShake = false;
        })
        .start();
}
//#endregion
}
    