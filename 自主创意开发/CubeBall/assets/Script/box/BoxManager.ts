
const { ccclass, property } = cc._decorator;

@ccclass
export class BoxManager extends cc.Component {
    public static instance: BoxManager = null;
    @property(cc.JsonAsset)
    private boxAsset: cc.JsonAsset = null

    private config: { [key in string]: { [key in number]: string } } = {}
    private config1:{[key in number]:{[key in string]:number}} = {}
    private BoxData:any = {}
    protected onLoad(): void {
        if (this.boxAsset) {
            let ids = Object.keys(this.boxAsset.json)
            ids.forEach(idx => {
                let id = parseInt(idx, 10)
                let info = this.boxAsset.json[id]
                let keys = Object.keys(info)
                keys.forEach(key => {
                    if (!this.config[key]) {
                        this.config[key] = {}
                    }
                    this.config[key][id] = info[key]
                })
            })
        }
        this.BoxData = this.boxAsset.json
        BoxManager.instance = this
    }
    public getData(){
        return this.BoxData
    }
}
