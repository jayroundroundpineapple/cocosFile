
const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinItem extends cc.Component {
    @property(cc.Node)
    private itemNode: cc.Node = null;
    start(){
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        // cc.view.setResizeCallback(() => {
        //     that.resize();
        // })
    }
    public resize(){
        let isVerTical = cc.winSize.height > cc.winSize.width
        if(this.itemNode==null){
            return
        }else{
            this.itemNode.x = isVerTical ? 0 : -cc.winSize.width / 3.5
        }
    }
    protected onDisable(): void {
    }
}

