var dev1 = {
  clientId: 'fb-test-001',
  lifetime: 79920,
  joinTime: 846503508,
  ip: '100.100.100.1',
  mac: 'AA:BB:CC:DD:EE:01',
  version: '4.8.2',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3301': [ 5700, 5601, 5604, 5605 ],
     '3311': [ 5850, 5706, 5701, 5852, 5805 ],
     '3314': [ 5702, 5705 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 79920,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'sivann',
           model: 'tester-01',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'teafega',
           hwVer: '2.9.4',
           swVer: '9.7.8' } },
     connMonitor: { '0': { ip: '100.100.100.1', routeIp: '' } },
     magnetometer: { '0': { xValue: 33.43, compassDir: 157.43 } },
     lightCtrl: 
      { '0': 
         { onOff: true,
           colour: 'mQ',
           units: '3Ss2',
           onTime: 178,
           cumulActivePwr: 106.34 } },
     illuminance: 
      { '0': 
         { sensorValue: 222.94,
           minMeaValue: 88.97,
           maxRangeValue: 221.7,
           resetMinMaxMeaValues: '_exec_' } } }
};

var dev2 = {
  clientId: 'fb-test-002',
  lifetime: 56790,
  joinTime: 472334043,
  ip: '100.100.100.2',
  mac: 'AA:BB:CC:DD:EE:02',
  version: '4.7.3',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3303': [ 5700, 5604, 5605 ],
     '3312': [ 5850, 5851, 5852 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 56790,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'sivann',
           model: 'tester-02',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'mok',
           hwVer: '9.7.10',
           swVer: '0.7.3' } },
     connMonitor: { '0': { ip: '100.100.100.2', routeIp: '' } },
     pwrCtrl: { '0': { onOff: false, dimmer: 218, onTime: 88 } },
     temperature: 
      { '0': 
         { sensorValue: 91.57,
           maxRangeValue: 226.06,
           resetMinMaxMeaValues: '_exec_' } } }
};

var dev3 = {
  clientId: 'fb-test-003',
  lifetime: 86096,
  joinTime: 242015173,
  ip: '100.100.100.3',
  mac: 'AA:BB:CC:DD:EE:03',
  version: '6.5.8',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3311': [ 5850, 5706, 5805 ],
     '3313': [ 5702, 5703, 5704, 5701, 5603 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 86096,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'sivann',
           model: 'tester-03',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'hav',
           hwVer: '8.2.6',
           swVer: '7.3.1' } },
     connMonitor: { '0': { ip: '100.100.100.3', routeIp: '' } },
     accelerometer: 
      { '0': 
         { xValue: 14.45,
           yValue: 252.84,
           zValue: 230.34,
           units: 'mjHcBm',
           minRangeValue: 45.05 } },
     lightCtrl: { '0': { onOff: false, colour: 'MPZAaM1sa)', cumulActivePwr: 64.26 } } }
};

var dev4 = {
  clientId: 'fb-test-004',
  lifetime: 83105,
  joinTime: 1000012342,
  ip: '100.100.100.4',
  mac: 'AA:BB:CC:DD:EE:04',
  version: '1.5.2',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3301': [ 5700, 5701, 5602, 5605 ],
     '3310': [ 5823, 5824, 5825, 5826 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 83105,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'sivann',
           model: 'tester-04',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'sa',
           hwVer: '2.5.10',
           swVer: '3.0.7' } },
     connMonitor: { '0': { ip: '100.100.100.4', routeIp: '' } },
     illuminance: 
      { '0': 
         { sensorValue: 29.7,
           units: 'S1lwQycLC)',
           maxMeaValue: 201.67,
           resetMinMaxMeaValues: '_exec_' } },
     loadCtrl: 
      { '0': 
         { eventId: 'yBB)ep4d',
           startTime: 1182101385,
           durationInMin: 148,
           criticalLevel: 143 } } }
};

var dev5 = {
  clientId: 'fb-test-005',
  lifetime: 624,
  joinTime: 23092482,
  ip: '100.100.100.5',
  mac: 'AA:BB:CC:DD:EE:05',
  version: '1.7.0',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3302': [ 5500, 5501, 5505, 5903, 5904 ],
     '3310': [ 5823, 5824, 5825, 5826, 5827 ],
     '3313': [ 5702, 5701, 5603 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 624,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'sivann',
           model: 'tester-05',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'kabeiba',
           hwVer: '4.8.9',
           swVer: '10.4.2' } },
     connMonitor: { '0': { ip: '100.100.100.5', routeIp: '' } },
     loadCtrl: 
      { '0': 
         { eventId: 'a7tZ6',
           startTime: 290492421,
           durationInMin: 238,
           criticalLevel: 124,
           avgLoadAdjPct: 173 } },
     accelerometer: { '0': { xValue: 169.41, units: '6U9zijLm', minRangeValue: 192.99 } },
     presence: 
      { '0': 
         { dInState: true,
           counter: 72,
           counterReset: '_exec_',
           busyToClearDelay: 190,
           clearToBusyDelay: 249 } } }
};

var dev6 = {
  clientId: 'fb-test-006',
  lifetime: 30591,
  joinTime: 95016048,
  ip: '100.100.100.6',
  mac: 'AA:BB:CC:DD:EE:06',
  version: '9.8.7',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3313': [ 5702, 5704, 5701, 5603, 5604 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 30591,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'ekwo',
           model: 'josofju',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'igeda',
           hwVer: '2.7.6',
           swVer: '6.8.2' } },
     connMonitor: { '0': { ip: '100.100.100.6', routeIp: '' } },
     accelerometer: 
      { '0': 
         { xValue: 6.27,
           zValue: 149.79,
           units: 'ZoMicoR$*',
           minRangeValue: 162.79,
           maxRangeValue: 185.37 } } }
};

var dev7 = {
  clientId: 'fb-test-007',
  lifetime: 20548,
  joinTime: 628123015,
  ip: '100.100.100.7',
  mac: 'AA:BB:CC:DD:EE:07',
  version: '2.2.6',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3200': [ 5500, 5501, 5503, 5751 ],
     '3300': [ 0, 1 ],
     '3301': [ 5700, 5601, 5602, 5603, 5604 ],
     '3308': [ 5900, 5706, 5701 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 20548,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'usu',
           model: 'pesom',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'bupih',
           hwVer: '1.1.7',
           swVer: '5.10.4' } },
     connMonitor: { '0': { ip: '100.100.100.7', routeIp: '' } },
     setPoint: { '0': { setPointValue: 31.43, colour: 'nJH0U]Z]l', units: 'YcsRj' } },
     illuminance: 
      { '0': 
         { sensorValue: 214.48,
           minMeaValue: 253.13,
           maxMeaValue: 67.28,
           minRangeValue: 140.92,
           maxRangeValue: 97.92 } },
     dIn: 
      { '0': 
         { dInState: true,
           counter: 187,
           debouncePeriod: 255,
           sensorType: 'hR!' } } }
};

var dev8 = {
  clientId: 'fb-test-008',
  lifetime: 59445,
  joinTime: 346401723,
  ip: '100.100.100.8',
  mac: 'AA:BB:CC:DD:EE:08',
  version: '6.9.10',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3310': [ 5823, 5824, 5825 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 59445,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'ra',
           model: 'lim',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'sesag',
           hwVer: '6.9.9',
           swVer: '7.0.7' } },
     connMonitor: { '0': { ip: '100.100.100.8', routeIp: '' } },
     loadCtrl: { '0': { eventId: '', startTime: 778244577, durationInMin: 120 } } }
};

var dev9 = {
  clientId: 'fb-test-009',
  lifetime: 19595,
  joinTime: 286156271,
  ip: '100.100.100.9',
  mac: 'AA:BB:CC:DD:EE:09',
  version: '2.0.0',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3314': [ 5702, 5703, 5704 ],
     '3315': [ 5700, 5701, 5601, 5603, 5605 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 19595,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'bajahiegi',
           model: 'fozejgud',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'dunahwes',
           hwVer: '4.6.10',
           swVer: '3.3.10' } },
     connMonitor: { '0': { ip: '100.100.100.9', routeIp: '' } },
     barometer: 
      { '0': 
         { sensorValue: 214.29,
           units: '9uP@',
           minMeaValue: 111.24,
           minRangeValue: 216.95,
           resetMinMaxMeaValues: '_exec_' } },
     magnetometer: { '0': { xValue: 140.76, yValue: 200.14, zValue: 145.72 } } }
};

var dev10 = {
  clientId: 'fb-test-010',
  lifetime: 5612,
  joinTime: 1143754723,
  ip: '100.100.100.10',
  mac: 'AA:BB:CC:DD:EE:10',
  version: '10.0.6',
  objList: 
   { '1': [ 0 ],
     '3': [ 0 ],
     '4': [ 0 ],
     '3300': [ 0, 1 ],
     '3301': [ 5700, 5602, 5604 ],
     '3314': [ 5702, 5704 ] },
  so: 
   { lwm2mServer: 
      { '0': 
         { shortServerId: null,
           lifetime: 5612,
           defaultMinPeriod: 1,
           defaultMaxPeriod: 60,
           regUpdateTrigger: '_unreadable_' } },
     device: 
      { '0': 
         { manuf: 'damalul',
           model: 'vowcus',
           reboot: '_unreadable_',
           availPwrSrc: 0,
           pwrSrcVoltage: 5,
           devType: 'ke',
           hwVer: '5.5.0',
           swVer: '0.3.0' } },
     connMonitor: { '0': { ip: '100.100.100.10', routeIp: '' } },
     illuminance: { '0': { sensorValue: 60.9, maxMeaValue: 125.94, maxRangeValue: 29.93 } },
     magnetometer: { '0': { xValue: 138.57, zValue: 84.03 } } }
};

module.exports = [
    dev1, dev2, dev3, dev4, dev5, dev6, dev7, dev8, dev9, dev10 
];