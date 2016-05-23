var controller = require('./controller.js'),
    FreebirdBase = reuqire('freebird-base'),
    Netcore = FreebirdBase.Netcore;

var nc = new Netcore('mock', controller, {
    phy: 'test_phy',
    nwk: 'test_nwk'
});

nc.cookRawDev = function (dev, rawDev, cb) {
    dev.setNetInfo({
        role: '',
        parent: '0',
        maySleep: true,
        sleepPeriod: 60,
        address: {
            permanent: 'xxxx',
            dyname: 'xxxx'
        }
    });
    dev.setAttrs({
        manufacturer: 'xxxx',
        model: 'xxxx',
        serial: 'xxx',
        version: {
            hw: 'xxxx',
            sw: 'xxxx',
            fw: 'wwww'
        },
        power: {
            type: 1,
            voltage: '5V'
        }
    });
    cb(err, dev);
};

nc.cookRawGad = function (gad, rawGad, cb) {
    gad.setPanelInfo({
        profile: 'xxx',
        class: 'require'
    });
    gad.setAttrs();
    cb(err, gad);
};

var netDrivers = {
    start: controller.start,            // function(callback) {}, callback(err)
    stop: controller.stop,              // function(callback) {}, callback(err)
    reset: controller.reset,            // function(mode, callback) {}, callback(err)
    permitJoin: controller.permitJoin,  // function(duration, callback) {}, callback(err, result), result: timeLeft (Number, ex: 180)
    remove: controller.remove,          // function(permAddr, callback) {}, callback(err, result), result: permAddr (String, ex: '0x12345678')
    ban: controller.ban,                // function(permAddr, callback) {}, callback(err, result), result: permAddr (String, ex: '0x12345678')
    unban: controller.unban,            // function(permAddr, callback) {}, callback(err, result), result: permAddr (String, ex: '0x12345678')
    ping: controller.ping               // function(permAddr, callback) {}, callback(err, result), result: timeInMs (Number, ex: 16)
};

var devDrivers = {
    read: controller.devRead,           // function(permAddr, attr, callback) {},       callback(err, result), result: value read (Type denpends, ex: 'hello', 12, false)
    write: controller.devWrite,         // function(permAddr, attr, val, callback) {},  callback(err, result), result: value written (optional, Type denpends, ex: 'hello', 12, false)
    identify: controller.identity,      // function(permAddr, callback) {},             callback(err)
};

var gadDrivers = {
    read: controller.gadREad,               // function(permAddr, auxId, attr, callback) {},          callback(err, result), result: value read (Type denpends, ex: 'hello', 12, false)
    write: controller.gadWrite,             // function(permAddr, auxId, attr, val, callback) {},     callback(err, result), result: value written (optional, Type denpends, ex: 'hello', 12, false)
    exec: controller.gadExec,               // function(permAddr, auxId, attr, args, callback) {},    callback(err, result), result: can be anything, depends on firmware implementation
    setReportCfg: controller.setReportCfg,  // function(permAddr, auxId, attrName, cfg, callback) {}, callback(err, result), result: set succeeds? (Boolean, true or false)
    getReportCfg: controller.getReportCfg,  // function(permAddr, auxId, attrName, callback) {},      callback(err, result), result: config object (Object, ex: { pmin: 10, pmax: 60, gt: 200 })
};

nc.registerNetDrivers(netDrivers);
nc.registerDevDrivers(devDrivers);
nc.registerGadDrivers(gadDrivers);

controller.start(function () {
    nc.commitReady();
});

controller.on('DEV_INCOMING', function (dev) {
    nc.commitDevIncoming();

    nc.commitGadIncoming();
});

controller.on('DEV_LEAVING', function (permAddr) {
    nc.commitDevLeaving();
});

controller.on('DEV_REPORTING', function (permAddr) {
    nc.commitDevReporting();
});

controller.on('GAD_REPORTING', function (permAddr) {
    nc.commitDevReporting();
});

// nc.commitGadReporting ();

// nc.commitReady()
// nc.commitDevIncoming()
// nc.commitDevLeaving()

// nc.commitGadIncoming()
// nc.commitDevReporting()
// nc.commitGadReporting ()

