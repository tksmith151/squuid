"use strict";

var crypto = require('crypto');

const RANDOM_SIZE = 6;
const RANDOM_BUFFER_SIZE = 128; // Adjust performance memory vs cpu using this number. NOTE: must be >= 1.
const RANDOM_BUFFER_BYTES = RANDOM_BUFFER_SIZE * RANDOM_SIZE;

var uuid_buffer = crypto.randomBytes(16);
var random_buffer = crypto.randomBytes(RANDOM_BUFFER_BYTES);
var random_buffer_index = 0;
var milliseconds = 0;
var timestamp_high = 0;
var hex_byte_strings = [];
var index = 0;

uuid_buffer[6] = (uuid_buffer[6] & 0x4F) | 0x40;
uuid_buffer[8] = (uuid_buffer[8] & 0xBF) | 0x80;

// Cache buffer to hexidecimal conversion
for (index = 0; index < 256; index++) {
    hex_byte_strings[index] = (index + 0x100).toString(16).substr(1);
}

function update () {
    milliseconds = Date.now();
    timestamp_high = (milliseconds / 0x1000000) & 0xffffff;
    uuid_buffer[0] = timestamp_high >>> 16;
    uuid_buffer[1] = timestamp_high >>> 8;
    uuid_buffer[2] = timestamp_high;
    uuid_buffer[3] = milliseconds >>> 16;
    uuid_buffer[4] = milliseconds >>> 8;
    uuid_buffer[5] = milliseconds;
    if (random_buffer_index >= RANDOM_BUFFER_BYTES) {
        crypto.randomFillSync(random_buffer)
        random_buffer_index = 0;
    }
    random_buffer.copy(uuid_buffer, 10, random_buffer_index, random_buffer_index + RANDOM_SIZE)
    random_buffer_index += RANDOM_SIZE;
}

function uuid_binary () {
    update();
    return uuid_buffer;
}

function uuid() {
    update();
    return hex_byte_strings[uuid_buffer[0]] +
    hex_byte_strings[uuid_buffer[1]] + 
    hex_byte_strings[uuid_buffer[2]] +
    hex_byte_strings[uuid_buffer[3]] +
    '-' +
    hex_byte_strings[uuid_buffer[4]] +
    hex_byte_strings[uuid_buffer[5]] +
    '-' +
    hex_byte_strings[uuid_buffer[6]] +
    hex_byte_strings[uuid_buffer[7]] +
    '-' +
    hex_byte_strings[uuid_buffer[8]] +
    hex_byte_strings[uuid_buffer[9]] +
    '-' +
    hex_byte_strings[uuid_buffer[10]] +
    hex_byte_strings[uuid_buffer[11]] + 
    hex_byte_strings[uuid_buffer[12]] +
    hex_byte_strings[uuid_buffer[13]] +
    hex_byte_strings[uuid_buffer[14]] +
    hex_byte_strings[uuid_buffer[15]];
}

module.exports = uuid;
module.exports.buffer = uuid_binary;