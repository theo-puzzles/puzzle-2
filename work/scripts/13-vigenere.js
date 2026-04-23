const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

// Vigenère cipher on bytes
function vigenereDecrypt(data, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        result[i] = (data[i] - keyBytes[i % keyBytes.length] + 256) % 256;
    }
    return result;
}

function vigenereEncrypt(data, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        result[i] = (data[i] + keyBytes[i % keyBytes.length]) % 256;
    }
    return result;
}

console.log("Decoded length:", decoded.length);

// Try Vigenère with video ID
const videoId = "N_0mpxB5iVQ";
const vigResult = vigenereDecrypt(decoded, videoId);
console.log("\nVigenère decrypt with video ID:", vigResult.toString('utf8'));
console.log("Hex:", vigResult.toString('hex'));

// Try with "iPhone 11"
const vig2 = vigenereDecrypt(decoded, "iPhone 11");
console.log("\nVigenère decrypt with 'iPhone 11':", vig2.toString('utf8'));

// Try with "UltraWide"
const vig3 = vigenereDecrypt(decoded, "UltraWide");
console.log("\nVigenère decrypt with 'UltraWide':", vig3.toString('utf8'));

// Try with "Where it all began"
const vig4 = vigenereDecrypt(decoded, "Where it all began");
console.log("\nVigenère decrypt with 'Where it all began':", vig4.toString('utf8'));

// Maybe it's the other way around? Vigenère encrypt then decrypt?
// Actually, what if the cipher is: plaintext → base64 → Vigenère (with video ID) → line1?
// So decode: line1 → Vigenère decrypt (video ID) → base64 decode

console.log("\n=== Try: line1 -> Vigenère decrypt -> base64 decode ===");
const vigOnLine1 = vigenereDecrypt(Buffer.from(line1, 'utf8'), videoId);
console.log("Vigenère decrypt of line1:", vigOnLine1.toString());

// Try to base64 decode the result
try {
    const base64Decoded = Buffer.from(vigOnLine1.toString(), 'base64');
    console.log("Base64 decode of that:", base64Decoded.toString('utf8'));
} catch(e) {
    console.log("Not valid base64 after Vigenère:", e.message);
}

// Try the reverse: base64 decode first, then Vigenère
console.log("\n=== Try: line1 -> base64 decode -> Vigenère decrypt ===");
// Already did that above, let's try different keys

for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began", "11", "5", "Skate", "Footage"]) {
    const result = vigenereDecrypt(decoded, key);
    const str = result.toString('utf8');
    const printable = str.replace(/[^\x20-\x7E]/g, '').length;
    if (printable > result.length * 0.3) {
        console.log(`Vigenère with "${key}":`, str);
    }
}

// Try Vigenère on the decoded bytes treating them as ASCII
// Actually, let me try the variant: Vigenère where we only shift printable chars
function vigenerePrintable(data, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(data.length);
    let keyPos = 0;
    for (let i = 0; i < data.length; i++) {
        const byte = data[i];
        if (byte >= 32 && byte <= 126) {  // Printable ASCII
            const keyByte = keyBytes[keyPos % keyBytes.length];
            const shifted = ((byte - 32) - (keyByte - 32) + 95) % 95 + 32;
            result[i] = shifted;
            keyPos++;
        } else {
            result[i] = byte;  // Non-printable unchanged
        }
    }
    return result;
}

console.log("\n=== Vigenère on printable chars only ===");
for (const key of ["iPhone 11", "UltraWide", "N_0mpxB5iVQ", "Where it all began"]) {
    const result = vigenerePrintable(decoded, key);
    console.log(`Vigenère printable with "${key}":`, result.toString('utf8'));
}
