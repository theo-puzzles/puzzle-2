const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Decoded bytes length:", decoded.length);
console.log("As hex:", decoded.toString('hex'));

// Try XOR with key "11" (iPhone 11 clue?)
const key11 = "11";
const result11 = Buffer.alloc(decoded.length);
for (let i = 0; i < decoded.length; i++) {
    result11[i] = decoded[i] ^ key11.charCodeAt(i % 2);
}
console.log("\nXOR with '11':", result11.toString('utf8'));
console.log("Hex:", result11.toString('hex'));

// Try XOR with numeric 11 (0x0B)
const result0x0B = Buffer.alloc(decoded.length);
for (let i = 0; i < decoded.length; i++) {
    result0x0B[i] = decoded[i] ^ 0x0B;
}
console.log("\nXOR with 0x0B (11):", result0x0B.toString('utf8'));
console.log("Hex:", result0x0B.toString('hex'));

// Try XOR with "UltraWide"
const keyUW = "UltraWide";
const resultUW = Buffer.alloc(decoded.length);
for (let i = 0; i < decoded.length; i++) {
    resultUW[i] = decoded[i] ^ keyUW.charCodeAt(i % keyUW.length);
}
console.log("\nXOR with 'UltraWide':", resultUW.toString('utf8'));
console.log("Hex:", resultUW.toString('hex'));

// Try different base64 alphabets
// Standard: A-Z, a-z, 0-9, +, /
// URL-safe: A-Z, a-z, 0-9, -, _

// What if the base64 was encoded with a different alphabet?
function base64DecodeCustom(str, alphabet) {
    const lookup = {};
    for (let i = 0; i < alphabet.length; i++) {
        lookup[alphabet[i]] = i;
    }
    // Decode logic would go here
    return str;
}

// Try treating the base64 as if it was URL-safe (replace + with -, / with _)
const urlSafe = line1.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
console.log("\nURL-safe base64:", urlSafe);
try {
    // Convert back to standard base64 for decoding
    const standard = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
    const padded = standard + '=='.slice(0, (4 - standard.length % 4) % 4);
    const decoded2 = Buffer.from(padded, 'base64');
    console.log("Decoded from URL-safe:", decoded2.toString('utf8'));
} catch(e) {
    console.log("Error:", e.message);
}

// Think about "5 steps" - maybe it's a combination of simple ciphers
// Let me try: Base64 → XOR → ROT47 → ?

function xorBuffer(buffer, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
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

// Try: XOR with "N_0mpxB5iVQ" then ROT47
const step1 = xorBuffer(decoded, "N_0mpxB5iVQ");
const step2 = rot47Buffer(step1);
console.log("\nXOR with video ID then ROT47:", step2.toString('utf8'));
