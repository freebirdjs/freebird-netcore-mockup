var chance = new require('chance')(),
    lwm2mId = require('lwm2m-id');
var util = require('util');
var oids = [ 3200, 3201, 3203, 3300, 3301, 3302, 3303, 3304, 
             3305, 3306, 3308, 3310, 3311, 3312, 3313, 3314,
             3315 ];


// var stringOfOids = pickedObjectIds.map(function (id) {
//         return lwm2mId.getOid(id).key;
//     });

// var specs = stringOfOids.map(function (id) {
//         return lwm2mId.SpecificResrcChar[id];
//     });
// console.log(pickedObjectIds);
// console.log(stringOfOids);
// console.log(specs);
// number of isntances?
// which attributes should we have in each instance?
// given random test thing.

// console.log(generateSmartObject('presence'));

console.log(util.inspect(new Device(), { depth: null }));

function generateSmartObject(oid) {
    var oidStr = lwm2mId.getOid(oid).key;
    var so = {};
    var smoInst = generateSmartObjectInstance(oidStr, 0);

    so[oidStr] = so[oidStr] || {};
    so[oidStr][0] = so[oidStr][0] || {};

    Object.assign(so[oidStr][0], smoInst);

    return so;
}

function generateSmartObjectInstance(oidStr, iid) {
    var inst = {},
        oSpec = lwm2mId.SpecificResrcChar[oidStr],
        mandRscKeys = [];

    for (var key in oSpec) {
        if (oSpec.hasOwnProperty(key) && oSpec[key].mand)
            mandRscKeys.push(key);
    }

    for (key in oSpec) {
        if (oSpec.hasOwnProperty(key) && !oSpec[key].mand && chance.bool())
            mandRscKeys.push(key);
    }

    mandRscKeys.forEach(function (ridStr) {
        var rSpec = oSpec[ridStr],
            rsc = generateRsource(ridStr, rSpec);

        Object.assign(inst, rsc);
    });

    return inst;
}

function generateRsource(ridStr, spec) {
    var val = getRandomByType(spec.type),
        rsc = {};



    rsc[ridStr] = val;
    return rsc;
}

function Device() {
    this.clientId = chance.hash({ length: 8 });
    this.lifetime = chance.integer({ min: 600, max: 86400 });
    this.joinTime = chance.timestamp();
    this.ip = chance.ip();
    this.mac = chance.mac_address();
    this.version = randomVersion();
    this.objList = {
        1: [ 0 ],
        3: [ 0 ],
        4: [ 0 ],
        3300: [ 0, 1 ]
    };

    this.so = {
        lwm2mServer:{
            0: {
                shortServerId: null,
                lifetime: this.lifetime,
                defaultMinPeriod: 1,
                defaultMaxPeriod: 60,
                regUpdateTrigger: "_unreadable_"
            }
        },
        device:{
            0: {
                manuf: chance.word(),
                model: chance.word(),
                reboot: "_unreadable_",
                availPwrSrc: 0,
                pwrSrcVoltage: 5,
                devType: chance.word(),
                hwVer: randomVersion(),
                swVer: randomVersion()
            }
        },
        connMonitor: {
            0: {
                ip: this.ip,
                routeIp: ""
            }
        },
    };

    var pickedObjectIds = chance.pick(oids, getSmallInterger(2) + 1);
    var self = this;


    if (!Array.isArray(pickedObjectIds))
        pickedObjectIds = [ pickedObjectIds ];

    pickedObjectIds.forEach(function (oid) {
        var so = generateSmartObject(oid);
        console.log('xxx');
        console.log(oid);
        console.log(so);
        Object.assign(self.so, so);
    });


}

function getSmartObject(oid) {
    var oItem = lwm2mId.getOid(oid);
    // var defs = lwm2mId.getRdef(oItem.key, );
    var specificResrcChar = lwm2mId.SpecificResrcChar[oItem.key],
        rscKeys = Object.keys(specificResrcChar),
        mandRscKeys = [],
        optRscKeys = [];

    rscKeys.forEach(function (rId) {
        if (true === specificResrcChar[rId].mand)
            mandRscKeys.push(rId);
        else
            optRscKeys.push(rId);
    });
}

function getSmallInterger(min, max) {
    if (arguments.length === 2) {
        return chance.integer({ min: min, max: max });
    } else if (arguments.length === 1) {
        max = min;
        min = 0;
        return chance.integer({ min: min, max: max });
    } else {
        return chance.integer({ min: 0, max: 10 });
    }
}

function getRandomByType(type) {
    var data;
    switch (type) {
        case 'string': 
            data = chance.string({ length: getSmallInterger() });
            break;
        case 'boolean': 
            data = chance.bool();
            break;
        case 'integer': 
            data = chance.integer({ min: 0, max: 255 });
            break;
        case 'execute': 
            data = '_unreadable_';
            break;
        case 'time': 
            data = chance.timestamp();
            break;
        case 'float': 
            data = chance.floating({ min: 0, max: 254, fixed: 2 });
            break;
        case 'opaque': 
            var bytes = getSmallInterger(),
                byteArr = [];

            for (var i = 0; i < bytes; i++) {
                byteArr.push(getSmallInterger(255));
            }

            data = new Buffer(byteArr);
            break;
        default:
            break;
    }

    return data;
}

function randomVersion() {
    var major = getSmallInterger(),
        minor = getSmallInterger(),
        patch = getSmallInterger();

    return major + '.' + minor + '.' + patch;
}

module.exports = Device;

// {
//     "clientId":"khh-port-power-mon-01",
//     "joinTime":1460448761558,
//     "so":{
//         "lwm2mServer":{
//             "0":{
//                 "shortServerId":null,
//                 "lifetime":86400,
//                 "defaultMinPeriod":1,
//                 "defaultMaxPeriod":60,
//                 "regUpdateTrigger":"_unreadable_"
//             }
//         },
//         "device":{
//             "0":{
//                 "manuf":"sivann",
//                 "model":"dragonball",
//                 "reboot":"_unreadable_",
//                 "availPwrSrc":0,
//                 "pwrSrcVoltage":5,
//                 "devType":"Pump Monitor",
//                 "hwVer":"v0.0.1",
//                 "swVer":"v0.2.1"
//             }
//         },
//         "connMonitor":{
//             "0":{
//                 "ip":"192.168.1.114",
//                 "routeIp":""
//             }
//         },
//         "generic":{
//             "0":{
//                 "sensorValue":1023,
//                 "units":"A",
//                 "appType":"current sensor",
//                 "voltage":110
//             },
//             "1":{
//                 "sensorValue":47,
//                 "units":"cm",
//                 "appType":"distance sensor"
//             }
//         }
//     },
//     "lifetime":86400,
//     "ip":"192.168.1.114",
//     "mac":"9e:65:f9:0b:24:b8",
//     "version":"v0.0.1",
//     "objList":{
//         "1":[0],
//         "3":[0],
//         "4":[0],
//         "3300":[0,1]
//     }
// }