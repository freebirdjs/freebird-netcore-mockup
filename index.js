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
    start: null,        // function(callback) {}, callback(err)
    stop: null,         // function(callback) {}, callback(err)
    reset: null,        // function(mode, callback) {}, callback(err)
    permitJoin: null,   // function(duration, callback) {}, callback(err, result), result: timeLeft (Number, ex: 180)
    remove: null,       // function(permAddr, callback) {}, callback(err, result), result: permAddr (String, ex: '0x12345678')
    ban: null,          // function(permAddr, callback) {}, callback(err, result), result: permAddr (String, ex: '0x12345678')
    unban: null,        // function(permAddr, callback) {}, callback(err, result), result: permAddr (String, ex: '0x12345678')
    ping: null          // function(permAddr, callback) {}, callback(err, result), result: timeInMs (Number, ex: 16)
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

nc.registerNetDrivers(netDrivers);
nc.registerDevDrivers(devDrivers);
nc.registerGadDrivers(gadDrivers);
// nc.commitReady()
// nc.commitDevIncoming()
// nc.commitGadIncoming()
// nc.commitDevLeaving()
// nc.commitDevReporting()
// nc.commitGadReporting ()

