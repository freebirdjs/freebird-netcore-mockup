var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var chance = new require('chance')(),
    lwm2mId = require('lwm2m-id');

var MockDevice = require('./device'),
    devMocks = require('./dev_mocks'),
    rdm = require('./random_provider.js');

// CONSTANTS
var EVTS = {
    SYS_READY: 'SYS_READY',
    DEV_INCOMING: 'DEV_INCOMING',
    DEV_LEAVING: 'DEV_LEAVING',
    DEV_REPORTING: 'DEV_REPORTING',
    GAD_REPORTING: 'GAD_REPORTING'
};

var validGads = [
    'dIn', 'dOut', 'aIn', 'aOut', 'generic', 'illuminance', 'presence', 'temperature', 'humidity', 'pwrMea',
    'actuation', 'setPoint', 'loadCtrl', 'lightCtrl', 'pwrCtrl', 'accelerometer', 'magnetometer', 'barometer',
    'voltage', 'current', 'frequency', 'depth', 'percentage', 'altitude', 'load', 'pressure', 'loudness',
    'concentration', 'acidity', 'conductivity', 'power', 'powerFactor', 'distance', 'energy', 'direction',
    'time', 'gyrometer', 'colour', 'gpsLocation', 'positioner', 'buzzer', 'audioClip', 'timer', 'addressableTextDisplay',
    'onOffSwitch', 'levelControl', 'upDownControl', 'multipleAxisJoystick', 'rate', 'pushButton', 'multistateSelector'
];

// Controller
function Controller (cancelStartEmit) {
    EventEmitter.call(this);

    this.newDevFirer = null;
    this.devReportFirer = null;
    this.gadReportFirer = null;
    this.devLeavingFirer = null;
    this.devbox = [];
    this.heldDevbox = [];
    this.joinable = false;
    this.cancelStartEmit = cancelStartEmit || false;
}

util.inherits(Controller, EventEmitter);

/*************************************************************************************************/
/*** Protected                                                                                 ***/
/*************************************************************************************************/
Controller.prototype._pickDevice = function () {
    var randomInde;
    if (this.devbox.length) {
        randomIndex = chance.integer({ min: 0, max: this.devbox.length - 1 });
    } else {
        randomIndex = 0;
    }
    return this.devbox[randomIndex];
};

Controller.prototype._newDevice = function (newExistedDev) {
    var dev = new MockDevice();

    if (devMocks.length) {
        var devMock = devMocks.shift();

        if (devMock)
            dev.recover(devMock);
    }

    if (this._hasDevice(dev.clientId) && !newExistedDev) {
        return this._newDevice();
    } else if (this.devbox.length < 20 && !newExistedDev) {
        this.devbox.push(dev);
        this.emit(EVTS.DEV_INCOMING, dev);
        return dev;
    } else {
        dev = this._pickDevice();
        this.emit(EVTS.DEV_INCOMING, dev);
        return dev;
    }
};

Controller.prototype._hasDevice = function (clientId) {
    var has = false;

    for (var i = 0, len = this.devbox.length; i < len; i++) {
        has = (this.devbox[i].clientId === clientId);

        if (has)
            break;
    }
    return has;
};

Controller.prototype._holdDevice = function (permAddr) {
    var has = false,
        dev;

    for (var i = 0, len = this.devbox.length; i < len; i++) {
        has = (this.devbox[i].mac === permAddr);

        if (has) {
            dev = this.devbox.splice(i, 1);
            this.heldDevbox.push(dev);
            return dev;
        }
    }
};

Controller.prototype._reloadheldDevice = function () {
    devMocks = this.heldDevbox.concat(devMocks);
    this.heldDevbox.length = 0;
};

Controller.prototype._DeviceLeave = function (permAddr) {
    var dev;

    if (permAddr) {
        dev = this._holdDevice(permAddr);
    } else {
        dev = this._pickDevice();
    }

    if (dev)
        self.emit(EVTS.DEV_LEAVING, dev);

};

Controller.prototype._devAttrRandomChanges = function (eventType) {
    var dev = this._pickDevice();
    var pickAttrs = [ 'ip', 'version' ];
    var numPicks = chance.bool() ? 2 : 1;
    var picked;
    var devChanges = {
        dev: dev,
        data: {}
    };

    if (!dev)
        return;

    if (eventType === 'net') {
        picked = [ 'ip' ];
    } else if (eventType === 'attr') {
        picked = [ 'version' ];
    } else {
        picked = chance.pickset(pickAttrs, numPicks);

        if (!Array.isArray(picked))
            picked = [ picked ];   
    }

    picked.forEach(function (attr) {
        if (attr === 'ip') {
            dev.ip = chance.ip();
            dev.so.connMonitor[0].ip = dev.ip;
            devChanges.data.ip = dev.ip;
        } else if (attr === 'version') {
            dev.version = {};
            dev.version.hw = rdm.randomVersion();
            dev.version.sw = rdm.randomVersion();
            dev.version.fw = rdm.randomVersion();
            devChanges.data.version = dev.version;
        }
    });

    this.emit(EVTS.DEV_REPORTING, devChanges);
};

Controller.prototype._gadAttrRandomChanges = function (eventType, isAppend) {
    var dev = this._pickDevice();
    var so = dev.so,
        oidsStr = [],
        ridsStr = [],
        pickedInst,
        pickedOid,
        pickedRid,
        change = {},
        gadChanges = {
            dev: dev,
            oid: null,
            iid: 0,
            rid: null,
            data: null,
            isAppend: isAppend
        };

    if (!dev)
        return;

    for (var key in so) {
        oidsStr.push(key);
    }

    if (eventType === 'dev') {
        pickedOid = 'device';
    } else if (eventType === 'gad') {
        pickedOid = chance.pickset(oidsStr, 1);
        pickedOid = Array.isArray(pickedOid) ? pickedOid[0] : pickedOid;
        pickedOid = getGadClass(pickedOid);
    } else {
        pickedOid = chance.pickset(oidsStr, 1);
        pickedOid = Array.isArray(pickedOid) ? pickedOid[0] : pickedOid;
    }

    if (!pickedOid && eventType)
        this._gadAttrRandomChanges(eventType);

    pickedInst = so[pickedOid][0];

    for (key in pickedInst) {
        ridsStr.push(key);
    }

    pickedRid = chance.pickset(ridsStr, 1);
    pickedRid = Array.isArray(pickedRid) ? pickedRid[0] : pickedRid;

    var rdef = lwm2mId.getRdef(pickedOid, pickedRid);
    if (rdef.access !== 'E') {
        pickedInst[pickedRid] = rdm.getRandomByType(rdef.type);

        gadChanges.oid = pickedOid;
        gadChanges.rid = pickedRid;
        gadChanges.data = pickedInst[pickedRid];

        this.emit(EVTS.GAD_REPORTING, gadChanges);
    } else if (eventType) {
        this._gadAttrRandomChanges(eventType);
    }

    function getGadClass(gadId) {
        return validGads.find(function (vldGadId) {
            return (gadId === vldGadId);
        });
    }
};

/*************************************************************************************************/
/*** Public: Mandatory                                                                         ***/
/*************************************************************************************************/
Controller.prototype.startEmitNewDev = function () {
    var self = this;
    var randomDuration = chance.integer({ min: 500, max: 3000 });
    this.newDevFirer = setTimeout(function () {
        if (self.joinable) {
            self._newDevice();
        }

        self.stopEmitNewDev();
        self.startEmitNewDev();
    }, randomDuration);
};

Controller.prototype.stopEmitNewDev = function () {
    if (this.newDevFirer) {
        clearTimeout(this.newDevFirer);
        this.newDevFirer = null;
    }
};

Controller.prototype.startEmitDevChanges = function () {
    var self = this;
    var randomDuration = chance.integer({ min: 500, max: 3000 });

    this.devReportFirer = setTimeout(function () {
        self._devAttrRandomChanges();
        self.stopEmitDevChanges();
        self.startEmitDevChanges();
    }, randomDuration);
};

Controller.prototype.stopEmitDevChanges = function () {
    if (this.devReportFirer) {
        clearTimeout(this.devReportFirer);
        this.devReportFirer = null;
    }
};

Controller.prototype.startEmitDevLeaving = function () {
    var self = this;
    var randomDuration = chance.integer({ min: 5000, max: 15000 });

    this.devLeavingFirer = setTimeout(function () {
        self._DeviceLeave();
        self.stopEmitDevLeaving();
        self.startEmitDevLeaving();
    }, randomDuration);
};

Controller.prototype.stopEmitDevLeaving = function () {
    if (this.devLeavingFirer) {
        clearTimeout(this.devLeavingFirer);
        this.devLeavingFirer = null;
    }
};

Controller.prototype.startEmiGadChanges = function () {
    var self = this;
    var randomDuration = chance.integer({ min: 500, max: 3000 });

    this.gadReportFirer = setTimeout(function () {
        self._gadAttrRandomChanges();
        self.stopEmitGadChanges();
        self.startEmiGadChanges();
    }, randomDuration);
};

Controller.prototype.stopEmitGadChanges = function () {
    if (this.gadReportFirer) {
        clearTimeout(this.gadReportFirer);
        this.gadReportFirer = null;
    }
};

/*************************************************************************************************/
/*** Public: Drivers                                                                           ***/
/*************************************************************************************************/
Controller.prototype.start = function (done) {
    if (!cancelStartEmit) {
        this.startEmitNewDev();
        this.startEmitDevChanges();
        // this.startEmitDevLeaving();
        this.startEmiGadChanges();
    }

    this.emit('SYS_READY');
    if (done)
        done(null, true);
};

Controller.prototype.stop = function (done) {
    this.stopEmitNewDev();
    this.stopEmitDevChanges();
    // this.stopEmitDevLeaving();
    this.stopEmiGadChanges();
    if (done)
        done(null, true);
};

Controller.prototype.reset = function (mode, done) {
    var self = this;

    if (done)
        done(null, true);

    this.stop(function () {
        self.start(function () {
            // start again
        });
    });

};

Controller.prototype.permitJoin = function (duration, done) {
    duration = duration || 0;

    if (duration !== 0) {
        this.joinable = true;
        this._reloadheldDevice();
    } else {
        this.joinable = false;
    }

    if (done)
        done(null, 'permitJoin_' + duration);
};

Controller.prototype.remove = function (permAddr, done) {
    this._DeviceLeave(permAddr);

    if (done)
        done(null, 'remove_' + permAddr);
};

Controller.prototype.ban = function (permAddr, done) {
    this._holdDevice(permAddr);

    if (done)
        done(null, 'ban_' + permAddr);
};

Controller.prototype.unban = function (permAddr, done) {
    this._holdDevice(permAddr);
    
    if (done)
        done(null, 'unban_' + permAddr);
};

Controller.prototype.ping = function (permAddr, done) {
    if (done)
        done(null, 'ping_' + permAddr);
};

Controller.prototype.devRead = function (permAddr, attr, done) {
    if (done)
        done(null, 'devRead_' + permAddr + '_' + attr);
};

Controller.prototype.devWrite = function (permAddr, attr, val, done) {
    if (done)
        done(null, 'devWrite_' + permAddr);
};

Controller.prototype.devIdentify = function (permAddr, cdoneb) {
    if (done)
        done(null, 'devIdentify_' + permAddr);
};

Controller.prototype.gadRead = function (permAddr, auxId, attr, done) {
    if (done)
        done(null, 'gadRead_' + permAddr + '_' + auxId + '_' + attr);
};

Controller.prototype.gadWrite = function (permAddr, auxId, attr, val, done) {
    if (done)
        done(null, 'gadWrite_' + permAddr + '_' + auxId + '_' + attr);
};

Controller.prototype.gadExec = function (permAddr, auxId, attr, args, done) {
    if (done)
        done(null, 'gadExec_' + permAddr + '_' + auxId + '_' + attr);
};

Controller.prototype.writeReportCfg = function (permAddr, auxId, attrName, cfg, done) {
    if (done)
        done(null, 'writeReportCfg_' + permAddr + '_' + auxId + '_' + attrName);
};

Controller.prototype.readReportCfg = function (permAddr, auxId, attrName, done) {
    if (done)
        done(null, 'readReportCfg_' + permAddr + '_' + auxId + '_' + attrName);
};

module.exports = Controller;
