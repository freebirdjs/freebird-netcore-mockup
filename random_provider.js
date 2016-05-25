var chance = new require('chance')();
var rdm = {};

rdm.getSmallInterger = function (min, max) {
    if (arguments.length === 2) {
        return chance.integer({ min: min, max: max });
    } else if (arguments.length === 1) {
        max = min;
        min = 0;
        return chance.integer({ min: min, max: max });
    } else {
        return chance.integer({ min: 0, max: 10 });
    }
};

rdm.randomVersion = function () {
    var major = rdm.getSmallInterger(),
        minor = rdm.getSmallInterger(),
        patch = rdm.getSmallInterger();

    return major + '.' + minor + '.' + patch;
};

rdm.getRandomByType = function (type) {
    var data;
    switch (type) {
        case 'string': 
            data = chance.string({ length: rdm.getSmallInterger() });
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
            var bytes = rdm.getSmallInterger(),
                byteArr = [];

            for (var i = 0; i < bytes; i++) {
                byteArr.push(rdm.getSmallInterger(255));
            }

            data = new Buffer(byteArr);
            break;
        default:
            break;
    }
    return data;
};

module.exports = rdm;
