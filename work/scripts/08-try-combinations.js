const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

function rot47(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

function rot47Buffer(buffer) {
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        const code = buffer[i];
        if (code >= 33 && code <= 126) {
            result[i] = 33 + ((code - 33 + 47) % 94);
        } else {
            result[i] = code;
        }
    }
    return result;
}

function xorBuffer(buffer, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
}

// Strategy: Base64 → ROT47 → XOR
console.log("=== Strategy: Base64 → ROT47 → XOR ===");
const afterRot47 = rot47Buffer(decoded);
console.log("After ROT47:", afterRot47.toString('utf8'));

// Try XOR with various keys after ROT47
for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began", "Skate", "Footage"]) {
    const result = xorBuffer(afterRot47, key);
    const str = result.toString('utf8');
    const printable = str.replace(/[^\x20-\x7E]/g, '').length;
    if (printable > result.length * 0.5) {
        console.log(`XOR with "${key}":`, str);
    }
}

// Strategy: Base64 → XOR → ROT47
console.log("\n=== Strategy: Base64 → XOR → ROT47 ===");
for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "11", "5"]) {
    const afterXor = xorBuffer(decoded, key);
    const afterRot47 = rot47Buffer(afterXor);
    const str = afterRot47.toString('utf8');
    const printable = str.replace(/[^\x20-\x7E]/g, '').length;
    if (printable > afterRot47.length * 0.5) {
        console.log(`XOR "${key}" then ROT47:`, str);
    }
}

// Strategy: Try treating decoded as a string and applying ROT47 character by character
// (some bytes might be printable after all)
console.log("\n=== Check if decoded has any printable chars ===");
let printable2 = 0;
for (let i = 0; i < decoded.length; i++) {
    if (decoded[i] >= 32 && decoded[i] <= 126) {
        printable2++;
    }
}
console.log(`Printable: ${printable2}/${decoded.length}`);
if (printable2 > 0) {
    console.log("As text (with dots for non-printable):");
    let str = "";
    for (let i = 0; i < decoded.length; i++) {
        if (decoded[i] >= 32 && decoded[i] <= 126) {
            str += String.fromCharCode(decoded[i]);
        } else {
            str += ".";
        }
    }
    console.log(str);
}
