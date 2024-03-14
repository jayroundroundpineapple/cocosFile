declare var mraid;

/**平台类型 */
export enum PlayableType {
  None = 0,
  Applovin_Unity = 1,
  Ironsource = 2,
  Vungle = 3,
  Mindworks = 4,
  Kwai = 5,
  Facebook = 6,
}

/** 玩法模式 */
export enum PlayMode {
  /** 内置V1模式 */
  V1 = 0,
  /** 内置V2模式 */
  V2 = 1,
  /** 内置V3模式 */
  V3 = 2,
  /** 内置V4模式 */
  V4 = 3,
};

/**
 * 付款类型
 */
export enum PayType {
  /**
   * 主要
   */
  One = 0,
  /**
   * 次要
   */
  Tow, 
  /**
   * 扩展
   */
  Three,
  /**
   * 扩展
   */
  Four
}

/**
 * 试玩SDK
 */
export class PlayableSDK {

  public static get sdkType(): PlayableType {
    if (window['TGPlayable'])
      return window['TGPlayable'].sdkType;
    return PlayableType.None;
  }

  public static get payType(): PayType {
    if (window['TGPlayable'])
      return window['TGPlayable'].payMode;
    return PayType.One;
  }

  public static get playMode(): PlayMode {
    if (window['TGPlayable'])
      return window['TGPlayable'].playMode;
    return PlayMode.V1;
  }

  /**商店地址 */
  public static get storeUrl(): string {
    if (window['TGPlayable'])
      return window['TGPlayable'].storeUrl;
    return "";
  }

  /**
   * 应用名
   */
  public static get appName(): string {
    if (window['TGPlayable'])
      return window['TGPlayable'].appName;
    
    return "TGPlayble";
  }

  /**
   * 加载图标
   * @param callback 回调
   */
  public static loadIcon(callback: (error, spriteframe: cc.SpriteFrame) => void) {
    if (!window['TGPlayable'])
      return;
    
    const img = new Image();
    img.src = window['TGPlayable'].appIcon;
    img.onload = () => {
      const texture = new cc.Texture2D();
      texture.initWithElement(img);
      texture.handleLoadedTexture();
      let sf = new cc.SpriteFrame(texture);
      if (callback) {
        callback(null, sf);
      }
    };
    img.onerror = (event) => {
      if (callback) {
        callback(event, null);
      }
    };
  }

  /**
   * 下载跳转
   */
  public static download() {
    /** Applovin+Unity */
    this.mraidOpen();
    
    /** Ironsource */
    if (window['dapi'] && window['dapi'].openStoreUrl) {
      window['dapi'].openStoreUrl();
    }
    
    /** Mindworks */
    if (window['install']) {
      window['install']();
    }

    /** Vungle */
    parent.postMessage('download', '*')

    /** Kwai */
    if (window['ks_playable_openAppStore']) {
      window['ks_playable_openAppStore']();
    }
  }

  /**sdk适配 */
  public static adapter() {
    // VungleSDK 适配
    window.addEventListener('ad-event-pause', function () {
      // Pause audio/video/animations inside here
    });

    window.addEventListener('ad-event-resume', function() {
        // Resume audio/video/animations inside here
    });
  }

  //打开
  public static mraidOpen() {
    if (window['mraid']) {
      let userAgent = navigator.userAgent || navigator.vendor;
      let url = PlayableSDK.storeUrl;
      if (/android/i.test(userAgent)) {
        url = PlayableSDK.storeUrl;
      }
      mraid.open(url);
    }
  }

  /** 加载完 */
  public static gameReady() {
    //Mindworks
    if (window['gameReady']) {
      window['gameReady']();
    }

    /** Kwai */
    if (window['ks_playable_exposurePage']) {
      window['ks_playable_exposurePage']();
    }
  }

  /**试玩结束 */
  public static gameEnd() {
    /** Mindworks */
    if (window['gameEnd']) {
      window['gameEnd']();
    }

    /** Vungle */
    parent.postMessage('complete', '*');
  }

  /**进入交互事件 */
  public static onInteracted() {
    /** Vungle */
    parent.postMessage('interacted', '*');

    /** Kwai */
    if (window['ks_playable_startPlay']) {
      window['ks_playable_startPlay']();
    }
  }

  /**埋点 */
  public static HttpAPI(action: number) {
    //Mindworks
    if (window['HttpAPI']) {
      window['HttpAPI'].sendPoint("action&action=" + action);
    }
  }
}
// do something
window['gameStart'] = function () {

}

// do something 
window['gameClose'] = function () {

}
