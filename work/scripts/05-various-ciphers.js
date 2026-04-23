const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Decoded bytes length:", decoded.length);
console.log("As hex:", decoded.toString('hex'));

// Try ROT47 on the bytes (treating each byte as ASCII)
function rot47Bytes(buffer) {
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        const code = buffer[i];
        if (code >= 33 && code <= 126) {
            result[i] = 33 + ((code - 33 + 47) % 94);
        } else {
            result[i] = buffer[i]; // keep non-printable as is
        }
    }
    return result;
}

const rot47Result = rot47Bytes(decoded);
console.log("\nROT47 on decoded bytes:", rot47Result.toString('utf8'));
console.log("Hex:", rot47Result.toString('hex'));

// Try Caesar cipher with various shifts on the decoded bytes
for (let shift = 1; shift <= 25; shift++) {
    const result = Buffer.alloc(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        result[i] = (decoded[i] + shift) % 256;
    }
    const str = result.toString('utf8');
    // Check if result looks like printable text
    if (str.match(/^[\x20-\x7E]*$/)) {
        console.log(`Caesar shift ${shift}:`, str);
    }
}

// Try XOR with single bytes
for (let key = 0; key < 256; key++) {
    const result = Buffer.alloc(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        result[i] = decoded[i] ^ key;
    }
    const str = result.toString('utf8');
    // Check if result looks like printable text (allowing some non-printable)
    const printable = str.replace(/[^\x20-\x7E]/g, '').length;
    if (printable > decoded.length * 0.8) {
        console.log(`XOR with ${key} (${String.fromCharCode(key)}):`, str);
    }
}
