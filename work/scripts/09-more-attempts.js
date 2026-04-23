const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Decoded hex:", decoded.toString('hex'));
console.log("Decoded length:", decoded.length);

// Try reversing the decoded bytes
const reversed = Buffer.from(decoded.reverse());
console.log("\nReversed:", reversed.toString('utf8'));
console.log("Reversed hex:", reversed.toString('hex'));

// Check printable chars in reversed
let printable = 0;
for (let i = 0; i < reversed.length; i++) {
    if (reversed[i] >= 32 && reversed[i] <= 126) {
        printable++;
    }
}
console.log(`Printable in reversed: ${printable}/${reversed.length}`);

// Try XOR with key after reversing
function xorBuffer(buffer, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
}

// Try Vigenère cipher (works on text, so we need text input)
// But our decoded is binary... unless we treat it as text after some transformation

// Actually, let me try: what if the base64 was applied to ROT47'd text?
// That would mean: plaintext → ROT47 → base64 encode
// So to reverse: base64 decode → ROT47

// Wait, I already tried ROT47 on the decoded bytes and it didn't work...
// But what if I apply ROT47 to the base64 string first?

function rot47str(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

// Line 1 ROT47 then try to fix base64
const line1Rot47 = rot47str(line1);
console.log("\nLine 1 ROT47:", line1Rot47);

// The ROT47 of base64 will have invalid base64 chars
// But what if we map them back?
// Base64 alphabet: A-Z, a-z, 0-9, +, /
// ROT47 of these...

// Let me compute ROT47 of base64 alphabet
const b64alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
console.log("\nBase64 alphabet ROT47:");
for (let i = 0; i < b64alphabet.length; i++) {
    const char = b64alphabet[i];
    const rot = rot47str(char);
    console.log(`${char} → ${rot} (${char.charCodeAt(0)} → ${rot.charCodeAt(0)})`);
}

// Hmm, this might not be useful directly. Let me think differently.

// What if the puzzle is: 
// 1. Something (maybe nothing)
// 2. ROT47
// 3. Base64 encode
// So: plaintext → ROT47 → base64 → line 1

// To decode: line 1 → base64 decode → ROT47 → plaintext
// But I tried ROT47 on decoded and got garbage...

// Wait, let me check: is the ROT47 reversible? Yes, applying ROT47 twice gives original.
// So ROT47(ROT47(x)) = x

// Let me verify ROT47 is working correctly on my decoded bytes
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

// Apply ROT47 twice should give original
const once = rot47Buffer(decoded);
const twice = rot47Buffer(once);
console.log("\nROT47 twice equals original:", twice.equals(decoded));

// Since ROT47 on decoded doesn't give plaintext, 
// maybe the order is different: plaintext → base64 → ROT47 → line 1?
// That would mean line 1 is ROT47 of a base64 string

// Let me try: ROT47 inverse of line 1, then base64 decode
// Since ROT47 is its own inverse, ROT47(line1) should give the base64 of plaintext
const rotOfLine1 = rot47str(line1);
console.log("\nROT47 of line 1:", rotOfLine1);

// Try to base64 decode this (might fail due to invalid chars)
try {
    // First, we need to map invalid base64 chars back to valid ones
    // The ROT47 of base64 chars might not be valid base64
    console.log("Trying to decode ROT47 of line 1...");
    // Not directly possible since ROT47 produces non-base64 chars
} catch(e) {
    console.log("Error:", e.message);
}
