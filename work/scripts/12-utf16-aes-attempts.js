const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Decoded length:", decoded.length, "bytes");

// Try interpreting as UTF-16LE
try {
    const utf16le = decoded.toString('utf16le');
    console.log("\nUTF-16LE:", utf16le);
} catch(e) {
    console.log("UTF-16LE error:", e.message);
}

// Try interpreting as UTF-16BE
try {
    // Need even length for UTF-16BE
    const evenBuf = decoded.length % 2 === 0 ? decoded : decoded.slice(0, -1);
    const utf16be = evenBuf.toString('utf16be');
    console.log("UTF-16BE:", utf16be);
} catch(e) {
    console.log("UTF-16BE error:", e.message);
}

// Let me try AES decryption
// For AES we need a key and IV
// Maybe the key is from the video: "N_0mpxB5iVQ" or "iPhone 11 UltraWide"

const crypto = require('crypto');

function tryAES(decoded, key, iv) {
    try {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(decoded);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString('utf8');
    } catch(e) {
        return null;
    }
}

// Try with different keys
const keys = [
    "iPhone 11 UltraW",  // 16 bytes
    "N_0mpxB5iVQ=====", // Pad to 16 with = 
    "Where it all be",  // 16 bytes
    "UltraWide Skate",  // 16 bytes
];

console.log("\n=== AES-128-CBC attempts ===");
for (const keyStr of keys) {
    const key = Buffer.alloc(16);
    Buffer.from(keyStr).copy(key);
    const iv = Buffer.alloc(16, 0); // Zero IV
    
    const result = tryAES(decoded, key, iv);
    if (result) {
        console.log(`Key "${keyStr}":`, result);
    } else {
        console.log(`Key "${keyStr}": (decryption failed or invalid padding)`);
    }
}

// Try with video ID as key
console.log("\n=== Trying with video ID as key ===");
const videoId = "N_0mpxB5iVQ";
const keyBuf = Buffer.alloc(16);
Buffer.from(videoId).copy(keyBuf);
// Pad or truncate to 16 bytes
const key16 = keyBuf.slice(0, 16);
const iv16 = Buffer.alloc(16, 0);

try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key16, iv16);
    let decrypted = decipher.update(decoded);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log("AES-128-CBC with video ID:", decrypted.toString('utf8'));
    console.log("Hex:", decrypted.toString('hex'));
} catch(e) {
    console.log("Failed:", e.message);
}

// Try AES-256
try {
    const key256 = Buffer.from("iPhone 11 UltraWide Skate Footage Demo!!!!"); // 32+ bytes
    const key = key256.slice(0, 32);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(decoded);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log("\nAES-256-CBC with long key:", decrypted.toString('utf8'));
} catch(e) {
    console.log("AES-256 failed:", e.message);
}
