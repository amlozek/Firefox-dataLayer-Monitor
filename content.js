(function () {
    function hookDataLayer() {
        if (!window.dataLayer) {
            window.dataLayer = [];
        }

        const originalPush = window.dataLayer.push.bind(window.dataLayer);
        
        window.dataLayer.push = function (...args) {
            if (args.length > 0) {
                let methodUsed = "dataLayer.push";
                let eventName = "(no event name)";
                let logData = {};
                
                if (typeof args[0] === 'object' && args[0] !== null) {
                    if ('event' in args[0]) {
                        eventName = `"${args[0].event}"`;
                    } else if (0 in args[0] && args[0][0] === "event" && 1 in args[0] && typeof args[0][1] === "string") {
                        methodUsed = "gtag";
                        eventName = `"${args[0][1]}"`;
                    }
                    logData = { ...args[0] };
                } else {
                    logData = args[0];
                }
                
                if (args.length > 1) {
                    logData.additional = args[1];
                }
                
                console.log(`~ ${methodUsed} | Event: ${eventName}`, logData);
            }
            return originalPush.apply(this, args);
        };
    }

    function ensureDataLayerHooked() {
        if (!window.dataLayer) {
            window.dataLayer = [];
        }
        hookDataLayer();
    }

    // Inject script directly into page context to access the real window object
    const script = document.createElement('script');
    script.textContent = `(${hookDataLayer.toString()})();`;
    document.documentElement.appendChild(script);
    script.remove();
    
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", ensureDataLayerHooked);
    } else {
        ensureDataLayerHooked();
    }
})();