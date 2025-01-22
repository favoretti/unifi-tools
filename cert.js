const { Client } = require('pg')
const { X509Certificate, randomUUID } = require('crypto')
const fs = require('fs')


Mne = e => { let t = {}; return e && e.split(",").forEach(r => { if (!r.includes(":")) return; let [o, a] = r.split(":").map(n => n.toString().trim()); !o || !a || (t[o] ? t[o]?.push(a) : t[o] = [a]); }), t }
Fne = e => { let t = e.raw; return t[0] === 48 && t[1] === 130 && t[4] === 48 && t[5] === 130 && t[8] === 160 && t[9] === 3 && t[10] === 2 && t[11] === 1 && t[12] ? t[12] + 1 : 1 }

const x509 = new X509Certificate(fs.readFileSync('/etc/letsencrypt/live/key.favoretti.net/cert.pem'));
const key = fs.readFileSync('/etc/letsencrypt/live/key.favoretti.net/privkey.pem');

const xs = x509.toString()

const r = x509.toLegacyObject();
const s = JSON.stringify(r.subject), i = new Date(r.valid_to).toISOString(), c = new Date(r.valid_from).toISOString(), p = Fne(r), u = JSON.stringify(r.issuer).replace("'", "''"), d = JSON.stringify(Mne(r.subjectaltname)), f = r.serialNumber, m = r.fingerprint
let g = randomUUID()

const client = new Client({
    user: 'unifi-core',
    password: '',
    host: 'localhost',
    port: '5432',
    database: 'unifi-core',
});

client
    .connect()
    .then(() => {
        qu = `SELECT subject FROM user_certificates where subject @> \'${s}\'`
        client.query(qu, (err, result) => {
            if (err) {
                console.error('Error executing query', err);
            } else {
                if (result.rows.length) {
                    de = `delete from user_certificates where subject @> \'${s}\'`
                    client.query(de, (err, result) => {
                        if (err) {
                            console.error('Error executing query', err);
                        } else {
                            inst = `INSERT INTO user_certificates (id, name, key, cert, version, fingerprint, serial_number, subject, issuer, subject_alt_name, valid_from, valid_to) VALUES (\'${g}\', 'customcert', \'${key}\', \'${xs}\', \'${p}\', \'${m}\', \'${f}\', \'${s}\', json(\'${u}\'), \'${d}\', \'${c}\', \'${i}\')`
                            client.query(inst, (err, result) => {
                                if (err) {
                                    console.error('Error executing query', err);
                                }
                                client
                                    .end()
                                    .then(() => {
                                        console.log(`${g}`);
                                    })
                                    .catch((err) => {
                                        console.error('Error closing connection', err);
                                    });
                            });
                        }
                    });
                } else {
                    inst = `INSERT INTO user_certificates (id, name, key, cert, version, fingerprint, serial_number, subject, issuer, subject_alt_name, valid_from, valid_to) VALUES (\'${g}\', 'customcert', \'${key}\', \'${xs}\', \'${p}\', \'${m}\', \'${f}\', \'${s}\', \'${u}\', \'${d}\', \'${c}\', \'${i}\')`
                    client.query(inst, (err, result) => {
                        if (err) {
                            console.error('Error executing query', err);
                        }
                        client
                            .end()
                            .then(() => {
                                console.log(`${g}`);
                            })
                            .catch((err) => {
                                console.error('Error closing connection', err);
                            });
                    });
                }
            }
        });
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });