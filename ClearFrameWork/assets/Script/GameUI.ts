import { BoxManager } from "./box/BoxManager";
import BoxItem from "./BoxItem";
import { Direction } from "./CommonMacro";
import { LanguageManager } from "./language/LanguageManager";
import RESSpriteFrame from "./RESSpriteFrame";
import Anim from "./utils/Anim";
import EffectUtils from "./utils/EffectUtils";
import MoneyChange from "./utils/MoneyChange";
import Utils from "./utils/Utils";


const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Prefab)
    private boxPrefab: cc.Prefab = null;
    @property(cc.Node)
    private boxBg: cc.Node = null;
    @property(cc.Node)
    private bornNode:cc.Node = null;
    @property(cc.Node)
    private bornArrNode:cc.Node[] = []

    private data: any = null;
    private gameRow:number = 5
    private gameColmun:number = 6
    private bornPool:cc.NodePool;
    private GWidth: number = 114
    private itemArr: any = []
    private allItemArr: any = {};
    protected start(): void {
        PlayerAdSdk.init();
        this.resize()
        let that = this;
        /**屏幕旋转尺寸改变 */
        cc.view.setResizeCallback(() => {
            that.resize();
        })
        cc.find('Canvas').on('touchstart', () => {

        })
        this.resize()
        this.data = BoxManager.instance.getData()
        let keysArr = Object.keys(this.data)
        for (let i = 0; i < keysArr.length; i++) {
            let boxPrefab = cc.instantiate(this.boxPrefab)
            let item = boxPrefab.getComponent(BoxItem)
            item.node.parent = this.boxBg
            let pos = new cc.Vec3(this.data[i].posX, this.data[i].posY)
            item.initItem(i, this.getRandomInt(1, 10), pos, () => {
                item.node.on('changePositon', this.changeFunc, this)
                if (i == keysArr.length - 1) {
                    this.initData()
                }
            })
            this.itemArr.push(item)
        }
    }
    private initData() {
        let keysArr = Object.keys(this.data)
        let row = this.data[keysArr.length - 1].row + 1
        let column = this.data[keysArr.length - 1].column + 1
        let index = 0
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                if (!this.allItemArr[i]) {
                    this.allItemArr[i] = {}
                }
                this.allItemArr[i][j] = this.itemArr[index++]
            }
        }
    }
    private changeFunc(SelectNode, row, colmun, direction) {
        let exchangeNode, SelectX, SelectY, exchangeX, exchangeY = null
        //向上移动
        if (direction == Direction.UP) {
            exchangeNode = this.allItemArr[row - 2][colmun - 1]
            SelectNode.y = SelectNode.originPosY = SelectNode.y + this.GWidth
            SelectX = SelectNode.x
            SelectY = SelectNode.y
            SelectNode.originPosX = SelectX
            exchangeNode.y = exchangeNode.originPosY = exchangeNode.y - this.GWidth
            exchangeX = exchangeNode.x
            exchangeY = exchangeNode.y
            exchangeNode.originPosX = exchangeX
            //交换位置
        } else if (direction == Direction.BOTTOM) {
            exchangeNode = this.allItemArr[row][colmun - 1]
            SelectNode.y = SelectNode.originPosY = SelectNode.y - this.GWidth
            SelectX = SelectNode.x
            SelectY = SelectNode.y
            SelectNode.originPosX = SelectX
            exchangeNode.originPosY = exchangeNode.y = exchangeNode.y + this.GWidth
            exchangeX = exchangeNode.x
            exchangeY = exchangeNode.y
            exchangeNode.originPosX = exchangeX
        } else if (direction == Direction.LEFT) {
            exchangeNode = this.allItemArr[row - 1][colmun - 2]
            SelectNode.x = SelectNode.originPosX = SelectNode.x - this.GWidth
            SelectX = SelectNode.x
            SelectY = SelectNode.y
            SelectNode.originPosY = SelectY
            exchangeNode.x = exchangeNode.originPosX = exchangeNode.x + this.GWidth
            exchangeX = exchangeNode.x
            exchangeY = exchangeNode.y
            exchangeNode.originPosY = exchangeY
        } else if (direction == Direction.RIGHT) {
            exchangeNode = this.allItemArr[row - 1][colmun]
            SelectNode.x = SelectNode.originPosX = SelectNode.x + this.GWidth
            SelectX = SelectNode.x
            SelectY = SelectNode.y
            SelectNode.originPosY = SelectY
            exchangeNode.x = exchangeNode.originPosX = exchangeNode.x - this.GWidth
            exchangeX = exchangeNode.x
            exchangeY = exchangeNode.y
            exchangeNode.originPosY = exchangeY
        } else {
            return;
        }
        this.reSetItemArr(row, colmun, direction)
        this.setMoveTween(SelectNode, exchangeNode, SelectX, SelectY, exchangeX, exchangeY)
        //移动后元素的行和列
        this.judgeClear(SelectNode.row, SelectNode.colmun)
    }
    /**判断消除 */
    private judgeClear(row: number, colmun: number) {
        let rowNum = 0
        let startIndex = 0
        let endIndex = 0
        //首次移动
        /**横向判断 */
        console.log(this.allItemArr);
        for (let i = 0; i < Object.keys(this.allItemArr[row - 1]).length - 1; i++) {
            if (this.allItemArr[row - 1][i].id == this.allItemArr[row - 1][i + 1].id) {
                if (!rowNum) startIndex = i
                rowNum++
                if (rowNum == 2) { //三消
                    endIndex = i + 1
                    setTimeout(() => {
                        for (let j = startIndex; j <= endIndex; j++) {
                            this.allItemArr[row - 1][j].setClear(true, () => {
                                this.allItemArr[row - 1][j].id = -1
                                this.allItemArr[row - 1][j].node.destroy()
                            })
                        }
                    }, 400);
                }
            } else {
                rowNum = 0
            }
        }
        /**纵向判断 */
        let colmunNum = 0
        let ColStartIndex = 0
        let ColEndIndex = 0
        for(let i = 0;i <this.gameRow-1;i++){
            if(this.allItemArr[i][colmun-1].id == this.allItemArr[i+1][colmun-1].id){
                if(!colmunNum)ColStartIndex = i
                colmunNum++
                if(colmunNum == 2){
                    ColEndIndex = i+1
                    setTimeout(()=>{
                        for(let j = ColStartIndex; j <= ColEndIndex;j++){
                            this.allItemArr[j][colmun-1].setClear(true,()=>{
                                this.allItemArr[j][colmun-1].id = -1
                                this.allItemArr[j][colmun-1].node.destroy()
                            })
                        }
                    },400)
                        setTimeout(() => {
                            this.BlockDown(row,colmun)
                        },1000);
                }
            }else{
                colmunNum = 0
            }
        }
    }
    //消除后方块下降
    private BlockDown(row:number,colmun:number){
        //竖消掉落
        let StartRow:number = 0
        let EndRow:number = 0
        for(let i = this.gameRow-1; i >= 0;i--){
            if(i==this.gameRow - 1){  //最后一行
                if(this.allItemArr[i][colmun-1].node == null)EndRow = i
            }else{
                if(this.allItemArr[i][colmun-1].node == null && this.allItemArr[i+1][colmun-1].node!=null){
                    EndRow = i
                }
                if(i == 0){
                    if(this.allItemArr[i][colmun-1].node == null){
                        StartRow = i
                    }
                }else{
                    if(this.allItemArr[i][colmun-1].node == null && this.allItemArr[i-1][colmun-1]!= null){
                        StartRow = i
                    }
                }
            } 
        }
        let  num = EndRow-StartRow+1  // n消
        for(let j = 0;j<StartRow;j++){
            let y = this.allItemArr[j][colmun-1].node.y
            cc.tween(this.allItemArr[j][colmun-1].node)
            .to(0.5,{y:y-num*this.GWidth},{easing:'quadInOut'})
            .call(()=>{
                this.ColExchangeItem(this.allItemArr[j][colmun-1],this.allItemArr[j+num][colmun-1])
            })
            .start()
        }
    }
    //竖直掉落
    private ColExchangeItem(startDown,endDown){
        let tempId = startDown.id
        startDown.id = endDown.id
        endDown.id = tempId
        let tempRow = startDown.row
        startDown.row = endDown.row
        endDown.row = tempRow
        let tempPos = startDown.originPosY
        startDown.originPosY = endDown.originPosY
        endDown.originPosY = tempPos
        endDown.node = startDown.node
        startDown.node = null
        let temp = startDown
        startDown = endDown
        endDown = temp
    }
    private getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    private reSetItemArr(row: number, colmun: number, direction: number) {
        let exchangeNode, selectNode = null;
        switch (direction) {
            case Direction.UP:
                exchangeNode = this.allItemArr[row - 2][colmun - 1]
                selectNode = this.allItemArr[row - 1][colmun - 1]
                exchangeNode.row = row
                selectNode.row = row - 1
                this.allItemArr[row - 1][colmun - 1] = exchangeNode
                this.allItemArr[row - 2][colmun - 1] = selectNode
                break;
            case Direction.BOTTOM:
                exchangeNode = this.allItemArr[row][colmun - 1]
                selectNode = this.allItemArr[row - 1][colmun - 1]
                exchangeNode.row = row
                selectNode.row = row + 1
                this.allItemArr[row - 1][colmun - 1] = exchangeNode
                this.allItemArr[row][colmun - 1] = selectNode
                break;
            case Direction.LEFT:
                exchangeNode = this.allItemArr[row - 1][colmun - 2]
                selectNode = this.allItemArr[row - 1][colmun - 1]
                exchangeNode.colmun = colmun
                selectNode.colmun = colmun - 1
                this.allItemArr[row - 1][colmun - 1] = exchangeNode
                this.allItemArr[row - 1][colmun - 2] = selectNode
                break;
            case Direction.RIGHT:
                exchangeNode = this.allItemArr[row - 1][colmun]
                selectNode = this.allItemArr[row - 1][colmun - 1]
                exchangeNode.colmun = colmun
                selectNode.colmun = colmun + 1
                this.allItemArr[row - 1][colmun - 1] = exchangeNode
                this.allItemArr[row - 1][colmun] = selectNode
                break;
        }
    }
    private setMoveTween(SelectNode, exchangeNode, SelectX, SelectY, exchangeX, exchangeY) {
        cc.tween(SelectNode.node).delay(0.1)
            .to(0.3, { x: SelectX, y: SelectY }, { easing: 'quadIn' })
            .start()
        cc.tween(exchangeNode.node).delay(0.1)
            .to(0.3, { x: exchangeX, y: exchangeY }, { easing: 'quadIn' })
            .start()
    }
    private resize() {
        const canvasValue: any = cc.Canvas.instance;
        let frameSize = cc.view.getFrameSize();
        let isVerTical = cc.winSize.height > cc.winSize.width
        if (isVerTical) {//竖屏
            if (cc.winSize.width / cc.winSize.height > 0.7) {
                cc.Canvas.instance.fitHeight = true;
                cc.Canvas.instance.fitWidth = false;
            } else {
                cc.Canvas.instance.fitHeight = false;
                cc.Canvas.instance.fitWidth = true;
            }
        } else {
            cc.Canvas.instance.fitHeight = true;
            cc.Canvas.instance.fitWidth = false;
        }
        cc.director.getScene().getComponentsInChildren(cc.Widget).forEach(function (t) {
            t.updateAlignment()
        });
    }
    private cashoutFunc() {
        console.log('跳转');
        cc.audioEngine.play(RESSpriteFrame.instance.clickAudioClip, false, 1)
        PlayerAdSdk.gameEnd()
        PlayerAdSdk.jumpStore()
    }
    protected onDisable(): void {

    }
}   
