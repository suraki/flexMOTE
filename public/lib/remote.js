;(function(window, $) {
    "use strict";

    // ----- Remote ------------------------------------------------------------
    /**
     * @singleton
     */
    var Remote = {};

    /**
     * socket.io handle
     */
    Remote.connection = null;

    /**
     * global flag to show/hide console.log messages
     */
    Remote.DEBUG = true;

    /**
     * channel is determined by the url: http://yourremoteserver.com/#/app-id
     */
    Remote.CHANNEL = window.location.href.replace("#/", "");

    // ----- event handler -----------------------------------------------------
    /**
     *
     */
    Remote.handleCommand = function(cmd) {
        Remote.DEBUG && console.log('remote | handleCommand ', cmd);

        switch (cmd.action) {
            case 'set':
                switch (cmd.type) {
                    case 'layout':
                        Remote.UI.buildLayout(cmd);
                        break;

                    case 'skin':
                        Remote.UI.loadSkin(cmd);
                        break;
                }
                break;

            case 'get':
                // return values via websocket
                switch (cmd.type) {
                    case 'layout':
                        console.log(' > get layout', Remote.UI.layouts[Remote.UI.currentLayout]);
                        break;

                    case 'skin':
                        console.log(' > get skin', Remote.UI.skins[Remote.UI.currentSkin]);
                        break;
                }
                break;
        }
    };

    /**
     * @param {Object} data
     * @param {Function} callback
     */
    Remote.sendCommand = function(data, callback) {
        if ( typeof data == 'function') {
            callback = data;
            data = {};
        }
        Remote.connection.emit('cmd', data, function() {
            var args = arguments;
            if (callback) {
                callback.apply(Remote.connection, args);
            }
        });
    };

    /**
     * call this to get the current latency (console.log output)
     */
    Remote.ping = function() {
        var start = Date.now();
        Remote.connection.emit('ping', function() {
            console.log('remote | ping: ' + ((Date.now() - start) / 2) + ' ms');
            setTimeout(Remote.ping, 5000);
        });
    };

    /**
     *
     */
    Remote.onConnect = function() {
        Remote.DEBUG && console.log("remote | connected to " + Remote.CHANNEL);
        Remote.DEBUG && console.log("remote | connected as " + Remote.connection.id);
    };

    /**
     *
     */
    Remote.onDisconnect = function() {
        Remote.DEBUG && console.log('remote | disconnected');
    };

    // window
    window.Remote = Remote;

})(window, window.jQuery ? window.jQuery : window.$);
