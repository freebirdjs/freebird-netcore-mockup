var EventEmitter = require('events');

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

// Controller
var controller = new EventEmitter();

Object.assign(controller, {
    newDevFirer: null,
    devReportFirer: null,
    gadReportFirer: null,
    devLeavingFirer: null,
    devbox: []
});

/*************************************************************************************************/
/*** Protected                                                                                 ***/
/*************************************************************************************************/
controller._pickDevice = function () {
    var randomInde;
    if (controller.devbox.length) {
        randomIndex = chance.integer({ min: 0, max: controller.devbox.length - 1 });
    } else {
        randomIndex = 0;
    }
    return controller.devbox[randomIndex];
};

controller._newDevice = function () {
    var dev = new MockDevice();

    if (devMocks.length) {
        var devMock = devMocks.shift();

        if (devMock)
            dev.recover(devMock);
    }

    if (this._hasDevice(dev.clientId)) {
        return this._newDevice();
    } else if (this.devbox.length < 20) {
        this.devbox.push(dev);
        this.emit(EVTS.DEV_INCOMING, dev);
        return dev;
    } else {
        dev = controller._pickDevice();
        this.emit(EVTS.DEV_INCOMING, dev);
        return dev;
    }
};

controller._hasDevice = function (clientId) {
    var has = false;

    for (var i = 0, len = this.devbox.length; i < len; i++) {
        has = (this.devbox[i].clientId === clientId);

        if (has)
            break;
    }
    return has;
};

controller._devAttrRandomChanges = function (dev) {
    var pickAttrs = [ 'ip', 'version' ];
    var numPicks = chance.bool() ? 2 : 1;
    var picked;
    var devChanges = {
        dev: dev,
        data: {}
    };

    picked = chance.pickset(pickAttrs, numPicks);

    if (!Array.isArray(picked))
        picked = [ picked ];

    picked.forEach(function (attr) {
        if (attr === 'ip') {
            dev.ip = chance.ip();
            dev.so.connMonitor[0].ip = dev.ip;
            devChanges.data.ip = dev.ip;
        } else if (attr === 'version') {
            dev.version = rdm.randomVersion();
            devChanges.data.version = dev.version;
        }
    });

    controller.emit(EVTS.DEV_REPORTING, devChanges);
};

controller._gadAttrRandomChanges = function (dev) {
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
            data: null
        };

    for (var key in so) {
        oidsStr.push(key);
    }

    pickedOid = chance.pickset(oidsStr, 1);
    pickedOid = Array.isArray(pickedOid) ? pickedOid[0] : pickedOid;

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

        controller.emit(EVTS.GAD_REPORTING, gadChanges);
    }
};

/*************************************************************************************************/
/*** Public: Mandatory                                                                         ***/
/*************************************************************************************************/
controller.startEmitNewDev = function () {
    var randomDuration = chance.integer({ min: 500, max: 5000 });
    controller.newDevFirer = setTimeout(function () {
        controller._newDevice();
        controller.stopEmitNewDev();
        controller.startEmitNewDev();
    }, randomDuration);
};

controller.stopEmitNewDev = function () {
    if (controller.newDevFirer) {
        clearTimeout(controller.newDevFirer);
        controller.newDevFirer = null;
    }
};

controller.startEmitDevChanges = function () {
    var dev = controller._pickDevice();
    var randomDuration = chance.integer({ min: 500, max: 5000 });

    controller.devReportFirer = setTimeout(function () {
        if (dev) {
            controller._devAttrRandomChanges(dev);
        }

        controller.stopEmitDevChanges();
        controller.startEmitDevChanges();
    }, randomDuration);
};

controller.stopEmitDevChanges = function () {
    if (controller.devReportFirer) {
        clearTimeout(controller.devReportFirer);
        controller.devReportFirer = null;
    }
};

controller.startEmitDevLeaving = function () {
    var dev = controller._pickDevice();
    var randomDuration = chance.integer({ min: 5000, max: 15000 });

    controller.devLeavingFirer = setTimeout(function () {
        if (dev) {
            controller.emit(EVTS.DEV_LEAVING, dev);
        }
        controller.stopEmitDevLeaving();
        controller.startEmitDevLeaving();
    }, randomDuration);
};

controller.stopEmitDevLeaving = function () {
    if (controller.devLeavingFirer) {
        clearTimeout(controller.devLeavingFirer);
        controller.devLeavingFirer = null;
    }
};

controller.startEmiGadChanges = function () {
    var dev = controller._pickDevice();
    var randomDuration = chance.integer({ min: 500, max: 5000 });

    controller.gadReportFirer = setTimeout(function () {
        if (dev) {
            controller._gadAttrRandomChanges(dev);
        }

        controller.stopEmitGadChanges();
        controller.startEmiGadChanges();
    }, randomDuration);
};

controller.stopEmitGadChanges = function () {
    if (controller.gadReportFirer) {
        clearTimeout(controller.gadReportFirer);
        controller.gadReportFirer = null;
    }
};

/*************************************************************************************************/
/*** Public: Drivers                                                                           ***/
/*************************************************************************************************/
controller.start = function (done) {
    controller.startEmitNewDev();
    controller.startEmitDevChanges();
    controller.startEmitDevLeaving();
    controller.startEmiGadChanges();
    controller.emit('SYS_READY');
    if (done)
        done(null, true);
};

controller.stop = function (done) {
    controller.stopEmitNewDev();
    controller.stopEmitDevChanges();
    controller.stopEmitDevLeaving();
    controller.stopEmiGadChanges();
    if (done)
        done(null, true);
};

controller.reset = function (mode, done) {
    if (done)
        done(null, true);

    controller.stop(function () {
        controller.start(function () {
            // start again
        });
    });

};

controller.permitJoin = function (duration, done) {
    if (done)
        done(null, 'permitJoin_' + duration);
};

controller.remove = function (permAddr, done) {
    if (done)
        done(null, 'remove_' + permAddr);
};

controller.ban = function (permAddr, done) {
    if (done)
        done(null, 'ban_' + permAddr);
};

controller.unban = function (permAddr, done) {
    if (done)
        done(null, 'unban_' + permAddr);
};

controller.ping = function (permAddr, done) {
    if (done)
        done(null, 'ping_' + permAddr);
};

controller.devRead = function (permAddr, attr, done) {
    if (done)
        done(null, 'devRead_' + permAddr + '_' + attr);
};

controller.devWrite = function (permAddr, attr, val, done) {
    if (done)
        done(null, 'devWrite_' + permAddr);
};

controller.devIdentify = function (permAddr, cdoneb) {
    if (done)
        done(null, 'devIdentify_' + permAddr);
};

controller.gadRead = function (permAddr, auxId, attr, done) {
    if (done)
        done(null, 'gadRead_' + permAddr + '_' + auxId + '_' + attr);
};

controller.gadWrite = function (permAddr, auxId, attr, val, done) {
    if (done)
        done(null, 'gadWrite_' + permAddr + '_' + auxId + '_' + attr);
};

controller.gadExec = function (permAddr, auxId, attr, args, done) {
    if (done)
        done(null, 'gadExec_' + permAddr + '_' + auxId + '_' + attr);
};

controller.writeReportCfg = function (permAddr, auxId, attrName, cfg, done) {
    if (done)
        done(null, 'writeReportCfg_' + permAddr + '_' + auxId + '_' + attrName);
};

controller.readReportCfg = function (permAddr, auxId, attrName, done) {
    if (done)
        done(null, 'readReportCfg_' + permAddr + '_' + auxId + '_' + attrName);
};

module.exports = controller;
