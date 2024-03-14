
const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinItem extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    start(){
        // this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        // cc.view.setResizeCallback(() => {
        //     that.resize();
        // })
    }
    protected onDisable(): void {
    }
}

