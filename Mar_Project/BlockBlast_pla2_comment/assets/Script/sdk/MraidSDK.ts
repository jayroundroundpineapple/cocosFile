declare var mraid;
/**
 * 适配Mraid
 */
export default class MraidSDK {

    public static init() {
        // console.log("Mraid-init")
        if (window['mraid']) {
            if (mraid.getState() === 'loading') {
                mraid.addEventListener('ready', MraidSDK.onSdkReady);
            } else {
                MraidSDK.onSdkReady();
            }

        }
    }

    public static onSdkReady() {
        mraid.addEventListener('viewableChange', MraidSDK.viewableChangeHandler);
        mraid.addEventListener('sizeChange', MraidSDK.sizeChangeHandler);
        if (mraid.isViewable()) {
            MraidSDK.showMyAd();
        }
    }


    public static timeID;

    public static sizeChangeHandler() {
        var size = mraid.getScreenSize();
        var w = size.width;
        var h = size.height;
        // console.log('@sizeChangeHandler. w=%s, h=%s', w, h);
        clearTimeout(MraidSDK.timeID);
        MraidSDK.timeID = setTimeout(() => {
            cc.find('Canvas').emit("sizeChange", size);
        }, 200);
    }


    public static viewableChangeHandler(viewable) {
        if (viewable) {
            MraidSDK.showMyAd();
            //console.log("---进入前台")
        } else {
            // pause
            //console.log("---进入后台")
            this.stopMyAd();
        }
    }

    public static showMyAd() {

    }



    public static stopMyAd() {

    }


}