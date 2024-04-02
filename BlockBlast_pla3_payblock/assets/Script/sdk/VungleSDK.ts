export default class VungleSDK {

    public static init() {
        // console.log("Vungle-init")
        window.addEventListener('ad-event-pause', function () {
            // Pause audio/video/animations inside here
        });

        window.addEventListener('ad-event-resume', function() {
            // Resume audio/video/animations inside here
        });
        
    }
}