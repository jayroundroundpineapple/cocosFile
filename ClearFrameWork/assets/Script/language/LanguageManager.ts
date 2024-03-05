import { PayType, PlayableSDK } from "../sdk/PlayableSDK";

const {ccclass, property} = cc._decorator;

/**
 * 按钮点击模式
 */
export enum LanguageType {
    English = 0,    // 英文
    Japanese,       // 日语
    German,         // 德语  
    French,         // 法语
    Russian,        // 俄语
    Spanish,        // 西班牙语
    Italian,        // 意大利语  1
    Ukrainian,      // 乌克兰语 1
    Arabic, //阿拉伯
    Portuguese,     // 葡萄牙语 
    Indonesian,     // 印度尼西亚语
    Hindi,          // 印地语
    Vietnamese,     // 越南语
    Thai,           // 泰语
    Malay,          // 马来语
    // Romanian,       // 罗马尼亚语 1
    Tagalog,        // 菲律宾语
    Korean,         // 韩语
    Turkish,        // 土耳其
    TW
}

/**
 * 支付软件信息类型
 */
export type PayAppInfo = {
    /**
     * 方案名
     */
    name: string,
    /**
     * 资源名
     */
    title: string
}

export interface PayInfoType {
    /**
     * 兑换比例
     */
    ratio: number,
    /**
     * 提现方案配置
     */
    pay: PayAppInfo[]
}

var PayConfig: { [key in number]: PayInfoType } = {
    [LanguageType.Italian]: { // 意大利语
        ratio: 5,
        pay: [
            {
                name: "PayPal",
                title: "frpaypal"
            },
        ]
    },
    [LanguageType.Ukrainian]: { // 乌克兰
        ratio: 5,
        pay: [
            {
                name: "PayPal",
                title: "frpaypal"
            },
        ]
    },
    [LanguageType.Arabic]: { // 阿拉伯
        ratio: 5,
        pay: [
            {
                name: "PayPal",
                title: "frpaypal"
            },
        ]
    },
    [LanguageType.French]: { // 法语
        ratio: 5,
        pay: [
            {
                name: "PayPal",
                title: "frpaypal"
            },
        ]
    },
    [LanguageType.TW]: { // 台湾
        ratio: 5,
        pay: [
            {
                name: "Line",
                title: "Line"
            },
        ]
    },
    [LanguageType.Portuguese]: { // 巴西
        ratio: 5,
        pay: [
            {
                name: "PIX",
                title: "pix"
            },
            {
                name: "Picpay",
                title: "picpay"
            },
            {
                name: "PagBank",
                title: "pagbank"
            },
            {
                name: "Nubank",
                title: "nubank"
            }
        ]
    },
    [LanguageType.English]: { // 美国
        ratio: 1,
        pay: [
            {
                name: "PayPal",
                title: "paypal"
            },
            {
                name: "Cash App",
                title: "cashapp"
            }
        ]
    },
    [LanguageType.Japanese]: {  // 日本
        ratio: 130,
        pay: [
            {
                name: "PayPay",
                title: "paypay"
            },
            {
                name: "LinePay",
                title: "linepay"
            } 
        ]
    },
    [LanguageType.Korean]: { // 韩国
        ratio: 1297,
        pay: [
            {
                name: "KakaoPay",
                title: "kakaopay"
            },
            {
                name: "Sumsung Pay",
                title: "sumsungpay"
            } 
        ]
    },
    [LanguageType.Thai]: { // 泰国
        ratio: 35,
        pay: [
            {
                name: "TrueMoney",
                title: "truemoney"
            },
            {
                name: "Rabbit LINE Pay",
                title: "rabbitline"
            } 
        ]
    },
    [LanguageType.Russian]: { // 俄罗斯
        ratio: 60,
        pay: [
            {
                name: "Qiwi Wallet",
                title: "qiwi"
            },
            {
                name: "Yandex.Money",
                title: "yandex"
            } 
        ]
    },
    [LanguageType.Turkish]: { // 土耳其
        ratio: 15,
        pay: [
            {
                name: "Papara",
                title: "papara"
            },
            {
                name: "Ininal",
                title: "ininal"
            }
        ]
    },
    [LanguageType.Vietnamese]: { // 越南
        ratio: 20000,
        pay: [
            {
                name: "MOMO",
                title: "momo"
            },
            {
                name: "ZALO PAY",
                title: "zalo"
            } 
        ]
    },
    [LanguageType.Tagalog]: { // 菲律宾
        ratio: 55,
        pay: [
            {
                name: "GCash",
                title: "gcash"
            },
            {
                name: "PalawanPay",
                title: "palawanpay"
            } 
        ]
    },
    [LanguageType.Malay]: { // 马来西亚
        ratio: 5,
        pay: [
            {
                name: "Touch ‘n Go eWallet",
                title: "ewallet"
            },
            {
                name: "PayPal",
                title: "paypal"
            } 
        ]
    },
    [LanguageType.Indonesian]: { // 印尼
        ratio: 15000,
        pay: [
            {
                name: "DANA",
                title: "dana"
            },
            {
                name: "OVO",
                title: "ovo"
            }
        ]
    },
    [LanguageType.German]: { // 德语
        ratio: 20,
        pay: [
            {
                name: "PayPal",
                title: "depaypal"
            }
        ]
    },
    [LanguageType.Spanish]: { // 墨西哥  西班牙
        ratio: 20,
        pay: [
            {
                name: "Mercado Pago",
                title: "mercado"
            },
            {
                name: "PayPal",
                title: "paypal"
            }
        ]
    }
}

@ccclass
export class LanguageManager extends cc.Component {

    public static instance: LanguageManager = null;
    @property(cc.JsonAsset)
    private languageAsset: cc.JsonAsset = null;

    @property({ type: cc.Enum(LanguageType) })
    private language: LanguageType = LanguageType.English;
    
    private config: { [key in string]: { [key in number]: string } } = {};

    protected onLoad(): void {
        this.InitLanguage();
        if (this.languageAsset) {
            let ids = Object.keys(this.languageAsset.json);
            ids.forEach(idx => {
                let id = parseInt(idx, 10);
                let info = this.languageAsset.json[id];
                let keys = Object.keys(info);
                keys.forEach(key => {
                    if (!this.config[key]) {
                        this.config[key] = {}
                    }
                    this.config[key][id] = info[key];
                });
            });
        }

        LanguageManager.instance = this;
    }

    private InitLanguage() {
        let language: string = cc.sys.language;
        if (language.indexOf("cn") >= 0) {          // 日语（Japanese） 
            this.language = LanguageType.TW;
        }
        else if (language.indexOf("sa") >= 0) {          // 日语（Japanese） 
            this.language = LanguageType.Arabic;
        } else if (language.indexOf("ja") >= 0) {          // 日语（Japanese） 
            this.language = LanguageType.Japanese;
        } else if (language.indexOf("de") >= 0) {   // 德语 (German)  
            this.language = LanguageType.German;
        } else if (language.indexOf("fr") >= 0) {   // 法语（French）  
            this.language = LanguageType.French;
        } else if (language.indexOf("ru") >= 0) {   // 俄语 (Russian)  
            this.language = LanguageType.Russian;
        } else if (language.indexOf("es") >= 0) {   // 西班牙语 (Spanish)   
            this.language = LanguageType.Spanish;
         } else if (language.indexOf("it") >= 0) {   // 意大利语（Italian） 
             this.language = LanguageType.Italian;
         } else if (language.indexOf("uk") >= 0) {   // 乌克兰语(Ukrainian)  
             this.language = LanguageType.Ukrainian;
        } else if (language.indexOf("pt") >= 0) {   // 葡萄牙语 (Portuguese) 
            this.language = LanguageType.Portuguese;
        } else if (language.indexOf("id") >= 0) {   // 印度尼西亚语 (Indonesian)
            this.language = LanguageType.Indonesian;
        } else if (language.indexOf("hi") >= 0) {   // 印地语(Hindi) 
            this.language = LanguageType.Hindi;
        } else if (language.indexOf("vi") >= 0) {   // 越南语(Vietnamese)
            this.language = LanguageType.Vietnamese;
        } else if (language.indexOf("th") >= 0) {   // 泰语(Thai)
            this.language = LanguageType.Thai;
        } else if (language.indexOf("ms") >= 0) {   // 马来语 (Malay)
            this.language = LanguageType.Malay;
        // } else if (language.indexOf("ro") >= 0) {   // 罗马尼亚语 (Romanian) 
        //     this.language = LanguageType.Romanian;
        } else if (language.indexOf("ph") >= 0) {   // 菲律宾语（Tagalog）
            this.language = LanguageType.Tagalog;
        } else if (language.indexOf("ko") >= 0) {   // 韩语（Korean）
            this.language = LanguageType.Korean;
        } else if (language.indexOf("tr") >= 0) {
            this.language = LanguageType.Turkish;   // 土耳其(Turkish)
        }else if(language.indexOf("mx") >= 0){ //墨西哥
            this.language = LanguageType.Spanish
        } else {
            this.language = LanguageType.English;   // 英语（English）
        }
    }

    /**
     * 获取翻译文案
     * @param id 翻译ID
     */
    public getText(id: number): string {
        let language = LanguageType[this.language];
        let keys = Object.keys(this.config);
        if (keys.indexOf(language) > -1) {
            return this.config[language][id] || "";
        }
        
        return "";
    }
    
    /**
     * 获取支付配置
     */
    public get payConfig(): PayInfoType {
        return PayConfig[this.language] || PayConfig[LanguageType.English];
    }

    /**
     * 单位换算
     * @param cash 现金
     */
    public formatUnit(cash: number): number {
        return cash * this.payConfig.ratio;
    }

    /**
     * 获取当前设置的类型提现信息
     */
    public get payAppInfo(): PayAppInfo {
        return this.getPayAppInfo(PlayableSDK.payType);
    }
  

    /**
     * 获取指定软件类型配置
     * @param type 软件类型
     */
    public getPayAppInfo(type: PayType): PayAppInfo {
        let config = LanguageManager.instance.payConfig;
        if (type < config.pay.length)
            return config.pay[type];
        
        return config.pay[0];
    }
    /**
     * 获取指定语言
     * @param type 软件类型
     */
    public getLanguageType(): any {
        let language: string = cc.sys.language;
        
        return language
    }
}
