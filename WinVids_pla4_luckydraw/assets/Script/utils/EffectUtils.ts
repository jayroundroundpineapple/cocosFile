/**
 * Created by hjx
 * 各种效果工具类
 */

export default class EffectUtils {



    /**
     * 开始放大缩小
     * @param node
     */
    public static startScale(node: cc.Node, time: number, v1: number = 1, v2: number = 0.05): void {
        // cc.Tween.stopAllByTarget(node);
        node.stopAllActions();
        node.scale = v1;
        cc.tween(node).repeatForever(cc.tween().to(time, { scale: v1 + v2 }).to(0.3, { scale: v1 })).start();
    }




    /**
      * 开始点击
      * @param obj
      */
    public static startClick(node: cc.Node, y: number, time: number = 0.5): void {
        // cc.Tween.stopAllByTarget(node);
        node.stopAllActions();
        node.y = y;
        cc.tween(node).repeatForever(cc.tween().to(time, { scale: 1.15, y: y + 20 }).to(time, { scale: 1.15, y: y })).start();

    }
    public static zhuandong(node: cc.Node, time: number) {
        node.stopAllActions();
        node.scale = 1;
        node.angle = 1;
        cc.tween(node).repeatForever(cc.tween().to(0.1, { scale: 1.2 }).to(time, { angle: -8 }).to(time * 2, { angle: 8 }).to(time, { angle: 0 }).to(0.1, { scale: 1 })).start();
    }




    /**
     * 移除动画
     * @param node
     */
    public static removeTweens(node: cc.Node): void {
        // cc.Tween.stopAllByTarget(node);
        node.stopAllActions();
    }
}
