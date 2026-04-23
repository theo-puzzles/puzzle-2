// Let me try binary or other base encodings

function rot47(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 33 && charCode <= 126) {
            let decoded = ((charCode - 33 + 47) % (126 - 33 + 1)) + 33;
            result += String.fromCharCode(decoded);
        } else {
            result += str[i];
        }
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Try binary - treat as binary string
// First convert from base64 to binary
const fromBase64 = Buffer.from(line1, 'base64');
const binaryStr = Array.from(fromBase64).map(b => b.toString(2).padStart(8, '0')).join('');
console.log("Binary length:", binaryStr.length);

// Interpret as ASCII
let binaryDecoded = "";
for (let i = 0; i < binaryStr.length; i += 8) {
    const byte = binaryStr.substring(i, i + 8);
    const charCode = parseInt(byte, 2);
    if (charCode >= 32 && charCode <= 126) {
        binaryDecoded += String.fromCharCode(charCode);
    }
}
console.log("Binary as ASCII:", binaryDecoded);

// Try hex decoding - treat original as hex string
console.log("\n=== Try treating as hex ===");
// See if the characters are valid hex
const hexChars = "0123456789abcdefABCDEF+/=";
let allHex = true;
for (const c of line1.replace(/=/g, '')) {
    if (!hexChars.includes(c)) {
        allHex = false;
        break;
    }
}
console.log("Is hex?", allHex);

// Try treating as base32
console.log("\n=== Try base32 ===");
// Let me check if it's valid base32
const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=";
let isBase32 = true;
for (const c of line1) {
    if (!base32Chars.includes(c)) {
        isBase32 = false;
        break;
    }
}
console.log("Is base32?", isBase32);

// Actually let me just try some simpler things
// Try decoding ROT47 then convert each char to binary and see patterns
console.log("\n=== ROT47 decoded as binary ===");
const decoded = rot47(line1);
const binEach = decoded.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
console.log(binEach.substring(0, 200));

// Maybe it's just XOR encoded
console.log("\n=== Try single-byte XOR on ROT47 result ===");
for (let xorKey = 0; xorKey < 256; xorKey++) {
    let result = "";
    for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) ^ xorKey);
    }
    if (result.toLowerCase().includes("the ") && result.includes(" ")) {
        console.log(`XOR ${xorKey}:`, result.substring(0, 60));
        break;
    }
}