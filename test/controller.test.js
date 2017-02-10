var expect = require('chai').expect;

var Controller = require('../lib/controller.js'),
    devMocks = require('../lib/dev_mocks');

var validGads = [
    'dIn', 'dOut', 'aIn', 'aOut', 'generic', 'illuminance', 'presence', 'temperature', 'humidity', 'pwrMea',
    'actuation', 'setPoint', 'loadCtrl', 'lightCtrl', 'pwrCtrl', 'accelerometer', 'magnetometer', 'barometer',
    'voltage', 'current', 'frequency', 'depth', 'percentage', 'altitude', 'load', 'pressure', 'loudness',
    'concentration', 'acidity', 'conductivity', 'power', 'powerFactor', 'distance', 'energy', 'direction',
    'time', 'gyrometer', 'colour', 'gpsLocation', 'positioner', 'buzzer', 'audioClip', 'timer', 'addressableTextDisplay',
    'onOffSwitch', 'levelControl', 'upDownControl', 'multipleAxisJoystick', 'rate', 'pushButton', 'multistateSelector'
];

function getGadClass(gadId) {
    return validGads.find(function (vldGadId) {
        return (gadId === vldGadId);
    });
}

describe('Controller Contructor', function() {
    var controller = new Controller();  // Controller (cancelStartEmit) 

    before(function (done) {
        controller.start(function () {
            done();
        });
    });

    // DEV_LEAVING: 'DEV_LEAVING',
    // DEV_REPORTING: 'DEV_REPORTING',
    // GAD_REPORTING: 'GAD_REPORTING'
    describe('#.permitJoin(duration, done)', function () {
        this.timeout(7000);

        it('should receive devIncoming event when permitJoin with 60', function (done) {
            controller.once('DEV_INCOMING', function (dev) {
                expect(dev.clientId).to.be.eql('fb-test-001');
                expect(dev.mac).to.be.eql('AA:BB:CC:DD:EE:01');
                done();
            });

            controller.permitJoin(60);
        });

        it('should not receive devIncoming event when permitJoin with 0', function (done) {
            var isDeviceIncoming = false;

            setTimeout(function () {
                if (!isDeviceIncoming)
                    done();
            }, 6000);

            controller.permitJoin(0);

            controller.once('DEV_INCOMING', function (dev) {
                isDeviceIncoming = true;
            });
        });
    });

    describe('#._devAttrRandomChanges(eventType)', function () {
        it('should receive devNetChanging event', function (done) {
            controller.once('DEV_REPORTING', function (devChanges) {
                expect(devChanges.data.hasOwnProperty('ip')).to.be.eql(true);
                done();
            });

            controller._devAttrRandomChanges('net');
        });

        it('should receive devReporting event', function (done) {
            controller.once('DEV_REPORTING', function (devChanges) {
                expect(devChanges.data.hasOwnProperty('version')).to.be.eql(true);
                done();
            });

            controller._devAttrRandomChanges('attr');
        });
    });

    describe('#._gadAttrRandomChanges(eventType, isAppend)', function (done) {
        it('should receive devReporting event', function () {
            controller.once('DEV_REPORTING', function (gadChanges) {
                expect(gadChanges.oid).to.be.eql('device');
                done();
            });

            controller._gadAttrRandomChanges('dev');
        });

        it('should receive gadReporting event', function (done) {
            controller.once('GAD_REPORTING', function (gadChanges) {
                if (getGadClass(gadChanges.oid))
                    done();
            });

            controller._gadAttrRandomChanges('gad');
        });

        it('should receive gadReporting event with append flag', function (done) {
            controller.once('GAD_REPORTING', function (gadChanges) {
                if (getGadClass(gadChanges.oid))
                    done();
            });

            controller._gadAttrRandomChanges('gad', true);
        });
    });

    describe('#._holdDevice(permAddr)', function () {
        it('should hold device in heldDevdox', function () {
            controller._holdDevice('AA:BB:CC:DD:EE:01');

            expect(controller._hasDevice('fb-test-001')).to.be.eql(false);
            expect(controller.heldDevbox[0].clientId).to.be.eql('fb-test-001');
            expect(controller.heldDevbox[0].mac).to.be.eql('AA:BB:CC:DD:EE:01');
        });
    });

    describe('#._reloadheldDevice()', function () {
        it('should push device to devMocks and receive devIncoming event', function () {
            controller._reloadheldDevice();

            expect(controller.heldDevbox.length).to.be.eql(0);
            expect(devMocks[0].clientId).to.be.eql('fb-test-001');
            expect(devMocks[0].mac).to.be.eql('AA:BB:CC:DD:EE:01');
        });
    });
});

