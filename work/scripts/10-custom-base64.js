const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// What if the base64 uses a ROT47'd alphabet?
// Standard: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
// ROT47'd:  pqrstuvwxyz{|}~!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOP

// Wait, that's not right. Let me compute the full ROT47 of standard base64 alphabet
const stdB64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const rot47B64 = stdB64.split('').map(char => {
    const code = char.charCodeAt(0);
    return String.fromCharCode(33 + ((code - 33 + 47) % 94));
}).join('');

console.log("Standard base64 alphabet:", stdB64);
console.log("ROT47'd base64 alphabet:", rot47B64);

// Hmm, the ROT47'd alphabet has characters like {|}~!"#$% etc.
// This doesn't look like a valid custom base64 alphabet (should be 64 chars, no repeats).

// Actually, ROT47 of the 64-char base64 alphabet gives 64 different chars (since ROT47 is a permutation).
console.log("ROT47'd alphabet length:", rot47B64.length);
console.log("Unique chars:", new Set(rot47B64).size);

// So we could have a custom base64 with ROT47'd alphabet!
// Let's try to decode line1 using this custom alphabet.

function base64DecodeCustom(str, alphabet) {
    // Build lookup table
    const lookup = {};
    for (let i = 0; i < alphabet.length; i++) {
        lookup[alphabet[i]] = i;
    }
    
    // Remove padding
    str = str.replace(/=/g, '');
    
    let bits = '';
    for (let i = 0; i < str.length; i++) {
        const val = lookup[str[i]];
        if (val === undefined) {
            console.log(`Invalid char at pos ${i}: ${str[i]}`);
            return null;
        }
        bits += val.toString(2).padStart(6, '0');
    }
    
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        const byte = bits.substring(i, i + 8);
        if (byte.length === 8) {
            bytes.push(parseInt(byte, 2));
        }
    }
    
    return Buffer.from(bytes);
}

// Try decoding with ROT47'd alphabet
console.log("\nTrying custom base64 with ROT47'd alphabet...");
const decoded2 = base64DecodeCustom(line1, rot47B64);
if (decoded2) {
    console.log("Decoded:", decoded2.toString('utf8'));
    console.log("Hex:", decoded2.toString('hex'));
} else {
    console.log("Failed to decode with custom alphabet");
}

// Actually, wait. What if the ENCODING used the ROT47'd alphabet?
// That would mean: plaintext → base64 with std alphabet → ROT47 the base64 string
// So: line1 = ROT47(std_base64_encode(plaintext))
// To decode: ROT47(line1) → std base64 decode

console.log("\n--- Alternative approach ---");
console.log("If line1 = ROT47(base64(plaintext))");
console.log("Then plaintext = base64_decode(ROT47(line1))");

function rot47str(str) {
    return str.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            return String.fromCharCode(33 + ((code - 33 + 47) % 94));
        }
        return char;
    }).join('');
}

const rot47line1 = rot47str(line1);
console.log("ROT47 of line1:", rot47line1);

// Now try to base64 decode this
try {
    const decoded3 = Buffer.from(rot47line1, 'base64');
    console.log("Base64 decode of ROT47(line1):", decoded3.toString('utf8'));
    console.log("Hex:", decoded3.toString('hex'));
} catch(e) {
    console.log("Not valid base64");
}
