declare var dapi;
/**
 * 适配IronSource
 */
export default class IronSourceSDK {

    public static timeID;

    public static init() {
        // console.log("IronSource-init")
        if (window['dapi']) {
            if (dapi.isReady()) {
                IronSourceSDK.onReadyCallback();
            } else {
                dapi.addEventListener("ready", IronSourceSDK.onReadyCallback);
            }
        }
    }

    public static onReadyCallback() {
        dapi.removeEventListener("ready", IronSourceSDK.onReadyCallback);
        let isAudioEnabled = !!dapi.getAudioVolume();
        // console.log("getAudioVolume", dapi.getAudioVolume())
        if (dapi.isViewable()) {
            IronSourceSDK.adVisibleCallback({ isViewable: true });
        }
        let screenSize = dapi.getScreenSize();
        dapi.addEventListener("viewableChange", IronSourceSDK.adVisibleCallback);
        dapi.addEventListener("adResized", IronSourceSDK.adResizeCallback);
        dapi.addEventListener("audioVolumeChange", IronSourceSDK.audioVolumeChangeCallback);
    }

    public static adVisibleCallback(event) {
        // console.log(​"isViewable " + event.isViewable);
        if (event.isViewable) {
            //启动或恢复广告
            cc.sys["__audioSupport"].context.resume();
        } else {
            //暂停广告并静音
            cc.sys["__audioSupport"].context.suspend();

        }
    }

    public static adResizeCallback(event) {
        let screenSize = dapi.getScreenSize();
        // console.log(​"ad was resized width " + event.width + " height " + event.height);

        IronSourceSDK.timeID = setTimeout(() => {
            cc.find('Canvas').emit("sizeChange", screenSize);
        }, 200);
    }

    public static audioVolumeChangeCallback(volume) {
        let isAudioEnabled = !!volume;
        if (isAudioEnabled) {
            // 打开声音
        } else {
            // 关闭声音
        }
    }


}