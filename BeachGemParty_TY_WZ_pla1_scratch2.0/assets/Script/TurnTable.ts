import RESSpriteFrame from "./RESSpriteFrame";

/*******************************************************************************
 * 描述:    抽奖转盘
 * 给转盘所在节点绑上该组件，设置扇区，就可以实现抽奖功能
 * 1、调用turnTo方法，可以指定停在哪个扇区。
 * 2、支持2种扇区类型：
 *       等分扇区：所有扇区大小相同
 *       不规则扇区：自定义每个扇区大小
*******************************************************************************/
const { ccclass, property, menu } = cc._decorator;
enum SectorType { 等分扇区, 不规则扇区 }
const SAVERAT = 0.05;             //转盘每次停下后，与扇区交界线保持一定安全距离 = 扇区大小*SAVERAT
@ccclass
@menu('Comp/TurnTable')
export default class TurnTable extends cc.Component {
    @property({ min: 0, displayName: CC_DEV && '加速时间' })
    private time0: number = 2;
    @property({ min: 0, displayName: CC_DEV && '匀速时间' })
    private time1: number = 2;
    @property({ min: 0, displayName: CC_DEV && '减速时间' })
    private time2: number = 2;
    @property({ type: cc.Enum(SectorType), displayName: CC_DEV && '扇区类型' })
    private type: SectorType = SectorType.等分扇区;
    @property({ type: cc.Integer, min: 0, displayName: CC_DEV && '扇区数量', visible() { return this.type === SectorType.等分扇区 } })
    private sectorNum: number = 0;
    @property({ type: [cc.Vec2], displayName: CC_DEV && '扇区', visible() { return this.type === SectorType.不规则扇区 } })
    private sector: cc.Vec2[] = [];

    private markAngle: number[] = [];
    private angles: number[] = [];
    private isTurning: boolean = false;
    private sectorID: number = 0;

    start() {
        if (this.type === SectorType.等分扇区) {
            let deltAngle = 360 / this.sectorNum;
            let saveAngle = deltAngle * SAVERAT;
            for (let i = 0; i < this.sectorNum; ++i) {
                this.angles.push(i * deltAngle + saveAngle, (i + 1) * deltAngle - saveAngle);
            }
        } else {
            for (let i = 0, len = this.sector.length; i < len; ++i) {
                let sector = this.sector[i];
                let saveAngle = (sector.y - sector.x) * SAVERAT;
                this.angles.push(sector.x + saveAngle, sector.y - saveAngle);
            }
        }
        this.markAngle = [this.time0 * 180, this.time1 * 720, this.time0 * 180 + this.time1 * 720, this.time2 * 360];
    }

    turnTo(id: number, callback: Function) {
        if (this.isTurning) {
            return;
        }
        this.isTurning = true;
        this.sectorID = id;
        let a = this.angles[this.sectorID << 1];
        let b = this.angles[(this.sectorID << 1) + 1];
        cc.tween(this.node)
            .by(this.time0, { angle: this.markAngle[0] }, { easing: 'cubicIn' })
            .by(this.time1, { angle: this.markAngle[1] })
            .to(this.time2, { angle: 360 * ~~((this.node.angle + this.markAngle[2]) / 360) + this.markAngle[3] + ~~((a - b) * Math.random() + b) }, { easing: 'cubicOut' })
            .call(() => {
                this.isTurning = false;
                callback()
                console.log('转动完毕');
            })
            .start();
    }
}