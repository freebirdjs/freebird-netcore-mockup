var util = require('util');

var expect = require('chai').expect,
    assert = require('chai').assert,
    Device = require('../device.js');

describe('Device Contructor', function() {
    var dev = new Device();
    // console.log(util.inspect(dev, { depth: null }));
    describe('new Device', function () {

        it('should return an object of Device class', function () {
            expect(dev).to.be.an.instanceof(Device);
            assert.equal(2, 2);
        });

        it('should has clientId with a string', function () {
            expect(dev).to.have.ownProperty('clientId');
            expect(dev.clientId).to.be.a('string');
        });

        it('should has lifetime with a number', function () {
            expect(dev).to.have.ownProperty('lifetime');
            expect(dev.lifetime).to.be.a('number');
        });

        it('should has joinTime with a number', function () {
            expect(dev).to.have.ownProperty('joinTime');
            expect(dev.joinTime).to.be.a('number');
        });

        it('should has ip with a string', function () {
            expect(dev).to.have.ownProperty('ip');
            expect(dev.ip).to.be.a('string');
        });

        it('should has mac with a string', function () {
            expect(dev).to.have.ownProperty('mac');
            expect(dev.mac).to.be.a('string');
        });

        it('should has version with a string', function () {
            expect(dev).has.ownProperty('version');
            expect(dev.version).to.be.a('string');
        });

        it('should has objList with an object', function () {
            expect(dev).has.ownProperty('objList');
            expect(dev.objList).to.be.an('object');

            expect(dev.objList).to.have.ownProperty('1');
            expect(dev.objList).to.have.ownProperty('3');
            expect(dev.objList).to.have.ownProperty('4');
            expect(dev.objList).to.have.ownProperty('3300');

            expect(dev.objList[1]).to.be.an('array');
            expect(dev.objList[3]).to.be.an('array');
            expect(dev.objList[4]).to.be.an('array');
            expect(dev.objList[3300]).to.be.an('array');
        });

        it('should has so with an object', function () {
            expect(dev).has.ownProperty('so');
            expect(dev.so).to.be.an('object');
            expect(dev.so).to.have.ownProperty('lwm2mServer');
            expect(dev.so).to.have.ownProperty('device');
            expect(dev.so).to.have.ownProperty('connMonitor');
        });
    });

    describe('Device deep property check', function () {
        it('should has so with an object in lwm2mServer[0]', function () {
            var lwm2mServer = dev.so.lwm2mServer,
                lwm2mServer0 = lwm2mServer[0];

            expect(lwm2mServer).to.have.ownProperty('0');
            expect(lwm2mServer0).to.have.ownProperty('shortServerId');
            expect(lwm2mServer0).to.have.ownProperty('lifetime');
            expect(lwm2mServer0).to.have.ownProperty('defaultMinPeriod');
            expect(lwm2mServer0).to.have.ownProperty('defaultMaxPeriod');
            expect(lwm2mServer0).to.have.ownProperty('regUpdateTrigger');

            expect(lwm2mServer0.shortServerId).to.be.null;
            expect(lwm2mServer0.lifetime).to.be.a('number');
            expect(lwm2mServer0.defaultMinPeriod).to.be.a('number');
            expect(lwm2mServer0.defaultMaxPeriod).to.be.a('number');
            expect(lwm2mServer0.regUpdateTrigger).to.be.a('string');

            expect(lwm2mServer0.lifetime).to.equal(dev.lifetime);
            expect(lwm2mServer0.defaultMinPeriod).to.equal(1);
            expect(lwm2mServer0.defaultMaxPeriod).to.equal(60);
            expect(lwm2mServer0.regUpdateTrigger).to.equal("_unreadable_");
        });


        it('should has so with an object in device[0]', function () {
            var device = dev.so.device,
                device0 = device[0];

            expect(device).to.have.ownProperty('0');
            expect(device0).to.have.ownProperty('manuf');
            expect(device0).to.have.ownProperty('model');
            expect(device0).to.have.ownProperty('reboot');
            expect(device0).to.have.ownProperty('availPwrSrc');
            expect(device0).to.have.ownProperty('pwrSrcVoltage');
            expect(device0).to.have.ownProperty('devType');
            expect(device0).to.have.ownProperty('hwVer');
            expect(device0).to.have.ownProperty('swVer');

            expect(device0.manuf).to.be.a('string');
            expect(device0.model).to.be.a('string');
            expect(device0.reboot).to.be.a('string');
            expect(device0.availPwrSrc).to.be.a('number');
            expect(device0.pwrSrcVoltage).to.be.a('number');
            expect(device0.devType).to.be.a('string');
            expect(device0.hwVer).to.be.a('string');
            expect(device0.hwVer).to.be.a('string');

            expect(device0.reboot).to.equal("_unreadable_");
            expect(device0.availPwrSrc).to.equal(0);
            expect(device0.pwrSrcVoltage).to.equal(5);
        });

        it('should has so with an object in connMonitor[0]', function () {
            var connMonitor = dev.so.connMonitor,
                connMonitor0 = connMonitor[0];

            expect(connMonitor).to.have.ownProperty('0');
            expect(connMonitor0).to.have.ownProperty('ip');
            expect(connMonitor0).to.have.ownProperty('routeIp');

            expect(connMonitor0.ip).to.be.a('string');
            expect(connMonitor0.routeIp).to.be.a('string');

            expect(connMonitor0.ip).to.equal(dev.ip);
            expect(connMonitor0.routeIp).to.equal('');
        });
    });
});

describe('Device Contructor', function() {
    var dev = new Device();
});