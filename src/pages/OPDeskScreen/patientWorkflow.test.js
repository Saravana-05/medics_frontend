import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { transitionPatient } from './patientWorkflow.js';
import { savePatientRecord, getPatientRecord } from './patientRecordStore.js';
const { patients, rooms } = JSON.parse(fs.readFileSync(new URL('../../data/deskPatients.json', import.meta.url)));

test('50 unique patients include 25 OP and 10 IP with 10 distinct assigned rooms', () => {
  assert.equal(patients.length, 50);
  assert.equal(new Set(patients.map(p => p.id)).size, 50);
  assert.equal(patients.filter(p => p.listType === 'op').length, 25);
  const ip = patients.filter(p => p.listType === 'ip');
  assert.equal(ip.length, 10);
  assert.equal(rooms.length, 10);
  assert.equal(new Set(ip.map(p => p.roomId)).size, 10);
  for (const patient of ip) {
    const room = rooms.find(r => r.id === patient.roomId);
    assert.ok(room);
    assert.equal(patient.room, room.number);
    assert.equal(patient.ipInfo.room, room.number);
    assert.equal(patient.ward, room.ward);
  }
});

test('OP/IP can be parked and finalised without changing identity or original data', () => {
  for (const type of ['op', 'ip']) {
    const original = patients.find(p => p.listType === type);
    const before = structuredClone(original);
    const parked = transitionPatient(original, 'park').patient;
    assert.equal(parked.listSection, 'parked');
    assert.equal(parked.id, original.id);
    const finalised = transitionPatient(parked, 'finalise').patient;
    assert.equal(finalised.listSection, type === 'op' ? 'treated' : 'ready');
    assert.equal(finalised.appointmentStatus, 'completed');
    assert.ok(transitionPatient(finalised, 'park').error);
    assert.ok(transitionPatient(finalised, 'finalise').error);
    assert.deepEqual(original, before);
  }
});

test('actions require a selected patient with an active visit', () => {
  assert.ok(transitionPatient(null, 'park').error);
  assert.ok(transitionPatient(patients.find(p => p.listType === 'registered'), 'finalise').error);
});

test('saved prescriptions stay associated with patient IDs across switches', () => {
  savePatientRecord('test-ip', { drugs: [{ id: 1, name: 'Demo prescription' }], labs: [] });
  savePatientRecord('test-op', { drugs: [] });
  assert.equal(getPatientRecord('test-ip').drugs[0].name, 'Demo prescription');
  assert.deepEqual(getPatientRecord('test-op').drugs, []);
  savePatientRecord('test-ip', { services: [{ id: 2 }] });
  assert.equal(getPatientRecord('test-ip').drugs.length, 1);
});
