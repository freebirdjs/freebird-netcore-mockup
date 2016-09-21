var lwm2mId = require('lwm2m-id'),
    FreebirdBase = require('freebird-base'),
    Netcore = FreebirdBase.Netcore,
    controller = require('./lib/controller.js');

var EventEmitter = require('events');
var validGads = [
    'dIn', 'dOut', 'aIn', 'aOut', 'generic', 'illuminance', 'presence', 'temperature', 'humidity', 'pwrMea',
    'actuation', 'setPoint', 'loadCtrl', 'lightCtrl', 'pwrCtrl', 'accelerometer', 'magnetometer', 'barometer',
    'voltage', 'current', 'frequency', 'depth', 'percentage', 'altitude', 'load', 'pressure', 'loudness',
    'concentration', 'acidity', 'conductivity', 'power', 'powerFactor', 'distance', 'energy', 'direction',
    'time', 'gyrometer', 'colour', 'gpsLocation', 'positioner', 'buzzer', 'audioClip', 'timer', 'addressableTextDisplay',
    'onOffSwitch', 'levelControl', 'upDownControl', 'multipleAxisJoystick', 'rate', 'pushButton', 'multistateSelector'
];
/***********************************************************************/
/*** Drivers                                                         ***/
/***********************************************************************/
var netDrivers = {
    start: controller.start,            // function(callback) {}, callback(err)
    stop: controller.stop,              // function(callback) {}, callback(err)
    reset: controller.reset,            // function(mode, callback) {}, callback(err)
    permitJoin: controller.permitJoin,  // function(duration, callback) {}, callback(err, timeLeft) (Number, ex: 180)
    remove: controller.remove,          // function(permAddr, callback) {}, callback(err, permAddr) (String, ex: '0x12345678')
    ban: controller.ban,                // function(permAddr, callback) {}, callback(err, permAddr) (String, ex: '0x12345678')
    unban: controller.unban,            // function(permAddr, callback) {}, callback(err, permAddr) (String, ex: '0x12345678')
    ping: controller.ping               // function(permAddr, callback) {}, callback(err, time)     (Number, ex: 16)
};

var devDrivers = {
    read: controller.devRead,           // function(permAddr, attr, callback) {},       callback(err, val)  (Type denpends, ex: 'hello', 12, false)
    write: controller.devWrite,         // function(permAddr, attr, val, callback) {},  callback(err, val)  (optional, Type denpends, ex: 'hello', 12, false)
    identify: controller.devIdentify,   // function(permAddr, callback) {},             callback(err)
};

var gadDrivers = {
    read: controller.gadRead,               // function(permAddr, auxId, attr, callback) {},          callback(err, val)    (Type denpends, ex: 'hello', 12, false)
    write: controller.gadWrite,             // function(permAddr, auxId, attr, val, callback) {},     callback(err, val)    (optional, Type denpends, ex: 'hello', 12, false)
    exec: controller.gadExec,               // function(permAddr, auxId, attr, args, callback) {},    callback(err, result) (can be anything, depends on firmware implementation)
    setReportCfg: controller.setReportCfg,  // function(permAddr, auxId, attrName, cfg, callback) {}, callback(err, result) (set succeeds? (Boolean, true or false))
    getReportCfg: controller.getReportCfg,  // function(permAddr, auxId, attrName, callback) {},      callback(err, cfg)    (Object, ex: { pmin: 10, pmax: 60, gt: 200 })
};

/***********************************************************************/
/*** Start Building Netcore                                          ***/
/***********************************************************************/
var nc = new Netcore('mock', controller, {
    phy: 'test_phy',
    nwk: 'test_nwk'
});

nc.registerNetDrivers(netDrivers);
nc.registerDevDrivers(devDrivers);
nc.registerGadDrivers(gadDrivers);

nc.cookRawDev = function (dev, rawDev, cb) {

    dev.setNetInfo({
        role: 'end-device',
        parent: '0',
        maySleep: true,
        sleepPeriod: 60,
        address: {
            permanent: rawDev.mac,
            dynamic: rawDev.ip
        }
    });

    dev.setAttrs({
        manufacturer: rawDev.so.device[0].manuf,
        model: rawDev.so.device[0].model,
        serial: '',
        version: {
            hw: rawDev.so.device[0].hwVer,
            sw: rawDev.so.device[0].swVer,
            fw: ''
        },
        power: {
            type: rawDev.so.device[0].availPwrSrc,
            voltage: rawDev.so.device[0].pwrSrcVoltage.toString()
        }
    });

    dev.extra = rawDev;

    process.nextTick(function () {
        cb(null, dev);
    });
};

nc.cookRawGad = function (gad, rawGad, cb) {
    var gadId = Object.keys(rawGad)[0],
        gadClass = getGadClass(gadId);

    if (!gadClass) {
        process.nextTick(function () {
            cb(new Error('No matched gadget'));
        });
    } else {
        gad.setPanelInfo({
            profile: 'none',
            classId: gadClass
        });

        gad.setAttrs(rawGad[gadId]);
        process.nextTick(function () {
            cb(null, gad);
        });
    }
};

controller.on('SYS_READY', function () {
    console.log('** SYS READY **');
    nc.commitReady();   // nc.enable() inside netcore
});

controller.on('DEV_INCOMING', function (dev) {
    console.log('** DEV INCOMING **');
    nc.commitDevIncoming(dev.mac, dev);

    for (var k in dev.so) {
        var rawGad = {};
        var oidStr = getGadClass(k);

        if (oidStr) {
            for (var iid in dev.so[k]) {
                var auxId = oidStr + '/' + iid;
                rawGad[k] = dev.so[k][iid];
                nc.commitGadIncoming(dev.mac, auxId, rawGad);
            }
        }
    }
});

controller.on('DEV_LEAVING', function (dev) {
    console.log('** DEV LEAVING **');
    nc.commitDevLeaving(dev.mac);
});

controller.on('DEV_REPORTING', function (devChanges) {
    var dev = devChanges.dev,
        attrs = {};
    // devChanges: { dev, data }
    if (devChanges.data.hasOwnProperty('ip')) {
        nc.commitDevNetChanging(dev.mac, { address: { dynamic: devChanges.data.ip } });
    }

    if (Object.keys(attrs).length) 
        nc.commitDevReporting(dev.mac, attrs);
});

controller.on('GAD_REPORTING', function (gadChanges) {
    // gadChanges = { dev, oid, iid, rid, data }
    var dev = gadChanges.dev,
        attrData = gadChanges.data;
    var oidStr = lwm2mId.getOid(gadChanges.oid).key,
        ridStr = lwm2mId.getRid(gadChanges.oid, gadChanges.rid).key,
        auxId = oidStr + '/' + gadChanges.iid;

    // var ridsToGet = [ 'manuf', 'model', 'hwVer', 'swVer', 'availPwrSrc', 'pwrSrcVoltage' ];

    var devAttrs = {},
        gadAttrs = {};

    if (oidStr === 'device' && gadChanges.iid === 0) {
        switch (ridStr) {
            case 'manuf':
                devAttrs.manufacturer = attrData;
                break;
            case 'model':
                devAttrs.model = attrData;
                break;
            case 'hwVer':
                devAttrs.version = devAttrs.version || {};
                devAttrs.version.hw = attrData;
                break;
            case 'swVer':
                devAttrs.version = devAttrs.version || {};
                devAttrs.version.sw = attrData;
                break;
            case 'availPwrSrc':
                devAttrs.power = devAttrs.power || {};
                devAttrs.power.type = attrData;
                break;
            case 'pwrSrcVoltage':
                devAttrs.power = devAttrs.power || {};
                devAttrs.power.voltage = attrData.toString();
                break;
        }

        if (Object.keys(devAttrs).length)
            nc.commitDevReporting(dev.mac, devAttrs);
    } else if (getGadClass(oidStr)) {
        gadAttrs[ridStr] = attrData;
        nc.commitGadReporting(dev.mac, auxId, gadAttrs);
    }
});

function getGadClass(gadId) {
    return validGads.find(function (vldGadId) {
        return (gadId === vldGadId);
    });
}

module.exports = nc;
