import RESSpriteFrame from "../RESSpriteFrame";

export default class Utils {


  /**获取指定月英文 */
  public static monthArr: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  /**
   * 获取当前年月日
   * @returns 
   */
  public static getYearMonthDay(): string {
    var date = new Date();
    let year = date.getFullYear(); //获取完整的年份(4位)
    let month = date.getMonth(); //获取当前月份(0-11,0代表1月)
    let day = date.getDate(); //获取当前日(1-31)
    //March 2,2021
    return `${Utils.monthArr[month]} ${day},${year}`;
  }


  /**
 * 获取两点间距离
 * @param p1X
 * @param p1Y
 * @param p2X
 * @param p2Y
 * @returns {number}
 */
  public static getDistance(p1X: number, p1Y: number, p2X: number, p2Y: number): number {
    let disX: number = p2X - p1X;
    let disY: number = p2Y - p1Y;
    let disQ: number = disX * disX + disY * disY;
    return Math.sqrt(disQ);
  }

  /**
     * 获取其他节点在该节点的局部坐标(2个节点不在同一个坐标系的情况)
     *
     * @static
     * @param {cc.Node} target 指定节点
     * @param {cc.Node} otherNode 其他节点
     * @return {*}  {Vector3}
     * @memberof FollyUtils
     */
  public static getLocalPositionWithOtherNode(target: cc.Node, otherNode: cc.Node): cc.Vec2 {
    if (!otherNode.parent) return null;
    let vec3 = otherNode.parent.convertToWorldSpaceAR(otherNode.position);//先转换成世界坐标
    vec3 = target.convertToNodeSpaceAR(vec3);
    return vec3;
  }

  /**碰撞 */
  public static circleCollision(node1: cc.Node, node2: cc.Node) {
    let p1 = node1.parent.convertToWorldSpaceAR(node1.position)
    let p2 = node2.parent.convertToWorldSpaceAR(node2.position)
    if (Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) < (node1.width / 2 + node2.width / 2)) {
      return true;
    } else {
      return false;
    }

  }

  public static checkRect(objA: cc.Node, objB: cc.Node): boolean {
    let p1 = objA.parent.convertToWorldSpaceAR(objA.position)
    let p2 = objB.parent.convertToWorldSpaceAR(objB.position)

    var x1 = p1.x - objA.width / 2;
    var y1 = p1.y + objA.height / 2;
    var x2 = p2.x - objB.width / 2;
    var y2 = p2.y + objB.height / 2;

    if (x1 < x2 + objB.width &&
      x1 + objA.width > x2 &&
      y1 < y2 + objB.height &&
      objA.height + y1 > y2) {
      return true
    }
    return false;
  }

  /**
   * 一维数组转换为二维数组
   * @param num 转为几个
   */
  public static arrTrans(num: number, arr) { // 一维数组转换为二维数组
    const iconsArr = []; // 声明数组
    arr.forEach((item, index) => {
      const page = Math.floor(index / num); // 计算该元素为第几个素组内
      if (!iconsArr[page]) { // 判断是否存在
        iconsArr[page] = [];
      }
      iconsArr[page].push(item);
    });
    return iconsArr;
  }

  /**等待时间 */
  public static await(time: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(null);
      }, time);
    })
  }


  /**
   * 深度复制
   * @param _data
   */
  public static copyDataHandler(obj: any): any {
    var newObj;
    if (obj instanceof Array) {
      newObj = [];
    }
    else if (obj instanceof Object) {
      newObj = {};
    }
    else {
      return obj;
    }
    var keys = Object.keys(obj);
    for (var i: number = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      newObj[key] = this.copyDataHandler(obj[key]);
    }
    return newObj;
  }

  /**
   * 弹窗接口
   * @param delay 弹窗延迟时间
   * @param canPlayerMusic 能否播放音频
   * @returns {number}
   */
public static showUI(node: cc.Node, audio: cc.AudioClip, delay: number,canPlayMusic:boolean,StartScale?:number,EndScale?:number,callback?: Function,time1?:number,time2?:number) {
  setTimeout(() => {
    canPlayMusic && cc.audioEngine.play(audio, false, 1)
    node.active = true
    if(!time1 && !time2){
      time1 = 0.3
      time2 = 0.2
    }
    if(!StartScale)StartScale = 1.1
    if(!EndScale)EndScale = 1
    cc.tween(node)
      .to(time1, { scale:StartScale }, { easing: 'sineOutIn' })
      .to(time2, { scale: EndScale }, { easing: 'sineOutIn' })
      .call(() => {
        if (callback) callback()
      })
      .start()
      canPlayMusic && cc.audioEngine.play(audio, false, 1)
  }, delay * 1000)
}

  /**
 * 获取一个区间的随机数
 * @param $from 最小值
 * @param $end 最大值
 * @returns {number}
 */
  public static limit($from: number, $end: number): number {
    $from = Math.min($from, $end);
    $end = Math.max($from, $end);
    let range: number = $end - $from;
    return $from + Math.random() * range;
  }

  /**
   * 获取一个区间的随机数(帧数)
   * @param $from 最小值
   * @param $end 最大值
   * @returns {number}
   */
  public static limitInteger($from: number, $end: number): number {
    return Math.round(this.limit($from, $end));
  }



  /**
   * 角度值转换为弧度制
   * @param angle
   */
  public static getRadian(angle: number): number {
    return angle / 180 * Math.PI;
  }


  /**
   * 将数组转换为2维数组
   */
  public static arrTrans2(arr: any[], num: number): any {
    let arr2: number[][] = [];
    for (let i: number = 0; i < arr.length; i += num) {
      arr2.push(arr.slice(i, i + num));
    }
    return arr2;
  }


  /**去重 */
  public static unique(arr) {
    for (var i = 0; i < arr.length; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) { //第一个等同于第二个，splice方法删除第二个
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  }

  /**
   * 
   * @param str 加载精灵图
   * @param sprite 
   */
  public static loadSpeite(str: string, sprite: cc.Sprite) {
    //加载标题
    cc.loader.loadRes(str, cc.SpriteFrame, function (err, spriteFrame) {
      if (err) return;
      sprite.spriteFrame = spriteFrame;
    });
  }

  /**字体加粗 */
  public static labelIsBold(label: cc.Label | cc.RichText, b: boolean = true) {
    if (label) label['_isBold'] = b;
  }
}