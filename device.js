var chance = new require('chance')(),
    lwm2mId = require('lwm2m-id'),
    util = require('util');

var rdm = require('./random_provider.js');
var oids = [ 3200, 3201, 3203, 3300, 3301, 3302, 3303, 3304, 
             3305, 3306, 3308, 3310, 3311, 3312, 3313, 3314,
             3315 ];

function Device() {
    this.clientId = chance.hash({ length: 8 });
    this.lifetime = chance.integer({ min: 600, max: 86400 });
    this.joinTime = chance.timestamp();
    this.ip = chance.ip();
    this.mac = chance.mac_address();
    this.version = rdm.randomVersion();
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
                hwVer: rdm.randomVersion(),
                swVer: rdm.randomVersion()
            }
        },
        connMonitor: {
            0: {
                ip: this.ip,
                routeIp: ""
            }
        },
    };

    /*************************************************************************************************/
    /*** Random Smart Object Instances Fill up                                                     ***/
    /*************************************************************************************************/
    var pickedObjectIds = chance.pick(oids, rdm.getSmallInterger(2) + 1);
    var self = this;

    if (!Array.isArray(pickedObjectIds))
        pickedObjectIds = [ pickedObjectIds ];

    pickedObjectIds.forEach(function (oid) {
        var oidStr = lwm2mId.getOid(oid).key;
        self.objList[oid] = self.objList[oid] || [];

        var so = generateSmartObject(oid);

        // refill objList
        for (var k in so[oidStr][0]) {
            var ridNum = lwm2mId.getRid(oid, k).value;
            self.objList[oid].push(ridNum);
        }

        Object.assign(self.so, so);
    });
}

/*************************************************************************************************/
/*** Private                                                                                   ***/
/*************************************************************************************************/
function generateSmartObject(oid) {
    var oidStr = lwm2mId.getOid(oid).key;
    var so = {};
    var smoInst = generateSmartObjectInstance(oidStr, 0);

    so[oidStr] = so[oidStr] || {};
    so[oidStr][0] = so[oidStr][0] || {};

    Object.assign(so[oidStr][0], smoInst);

    return so;
}

function getSmartObject(oid) {
    var oItem = lwm2mId.getOid(oid);
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
    var val = rdm.getRandomByType(spec.type),
        rsc = {};

    rsc[ridStr] = val;
    return rsc;
}

// var mydev = new Device();
// console.log(util.inspect(mydev, { depth: null }));

module.exports = Device;
