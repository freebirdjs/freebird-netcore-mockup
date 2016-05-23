var MockDevice = require('./device');
var chance = require('chance');
var controller = {
    devEmitter: null
};

controller.startEmitNewDev = function () {
    var self = this,
        dev = new MockDevice(),
        randomDuration = chance.integer({ min: 500, max: 5000 });

    controller.devEmitter = setTimeout(function () {
        self.emit('DEV_INCOMING', dev);
        self.startEmitNewDev();
    }, randomDuration);
};

controller.stopEmitNewDev = function () {
    if (controller.devEmitter)
        clearTimeout(controller.devEmitter);
};

controller.start = function (cb) {
    cb(null, true);

    // start emit

    // controller.on('DEV_INCOMING', function (dev) {
    //     nc.commitDevIncoming();

    //     nc.commitGadIncoming();
    // });

    // controller.on('DEV_LEAVING', function (permAddr) {
    //     nc.commitDevLeaving();
    // });

    // controller.on('DEV_REPORTING', function (permAddr) {
    //     nc.commitDevReporting();
    // });

    // controller.on('GAD_REPORTING', function (permAddr) {
    //     nc.commitDevReporting();
    // });

};

controller.stop = function (cb) {
    cb(null, true);
};

controller.reset = function (mode, cb) {
    cb(null, true);
};

controller.permitJoin = function (duration, cb) {
    cb(null, duration);
};

controller.remove = function (permAddr, cb) {
    cb(null, permAddr);
};

controller.ban = function (permAddr, cb) {
    cb(null, permAddr);
};

controller.unban = function (permAddr, cb) {
    cb(null, permAddr);
};

controller.ping = function (permAddr, cb) {
    cb(null, 10);
};

controller.devRead = function (permAddr, attr, cb) {
    cb(null, 10);
};

var devDrivers = {
    read: null,         // function(permAddr, attr, callback) {},       callback(err, result), result: value read (Type denpends, ex: 'hello', 12, false)
    write: null,        // function(permAddr, attr, val, callback) {},  callback(err, result), result: value written (optional, Type denpends, ex: 'hello', 12, false)
    identify: null,     // function(permAddr, callback) {},             callback(err)
};

var gadDrivers = {
    read: null,         // function(permAddr, auxId, attr, callback) {},          callback(err, result), result: value read (Type denpends, ex: 'hello', 12, false)
    write: null,        // function(permAddr, auxId, attr, val, callback) {},     callback(err, result), result: value written (optional, Type denpends, ex: 'hello', 12, false)
    exec: null,         // function(permAddr, auxId, attr, args, callback) {},    callback(err, result), result: can be anything, depends on firmware implementation
    setReportCfg: null, // function(permAddr, auxId, attrName, cfg, callback) {}, callback(err, result), result: set succeeds? (Boolean, true or false)
    getReportCfg: null, // function(permAddr, auxId, attrName, callback) {},      callback(err, result), result: config object (Object, ex: { pmin: 10, pmax: 60, gt: 200 })
};

module.exports = controller;
