const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Trying to find XOR keys that produce readable text...");

// Try all single byte XOR keys
console.log("\n=== Single byte XOR ===");
for (let key = 0; key < 256; key++) {
    const result = Buffer.alloc(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        result[i] = decoded[i] ^ key;
    }
    const str = result.toString('utf8');
    // Count printable ASCII characters
    let printable = 0;
    for (let i = 0; i < result.length; i++) {
        if (result[i] >= 32 && result[i] <= 126) {
            printable++;
        }
    }
    const ratio = printable / result.length;
    if (ratio > 0.7) {  // At least 70% printable
        console.log(`Key ${key} (${String.fromCharCode(key >= 32 && key <= 126 ? key : '.')}): ${str.substring(0, 50)}... (${Math.round(ratio*100)}% printable)`);
    }
}

// Try XOR with 2-byte keys (0-255 range)
console.log("\n=== Two byte XOR (first 50 keys each) ===");
for (let k1 = 0; k1 < 50; k1++) {
    for (let k2 = 0; k2 < 50; k2++) {
        const key = Buffer.from([k1, k2]);
        const result = Buffer.alloc(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
            result[i] = decoded[i] ^ key[i % 2];
        }
        const str = result.toString('utf8');
        let printable = 0;
        for (let i = 0; i < result.length; i++) {
            if (result[i] >= 32 && result[i] <= 126) {
                printable++;
            }
        }
        const ratio = printable / result.length;
        if (ratio > 0.8) {  // At least 80% printable
            console.log(`Key [${k1},${k2}]: ${str.substring(0, 50)}... (${Math.round(ratio*100)}% printable)`);
        }
    }
}

// Try keys from the video/puzzle
console.log("\n=== Trying meaningful keys ===");
const meaningfulKeys = [
    "iPhone 11",
    "UltraWide", 
    "Skate Footage",
    "N_0mpxB5iVQ",
    "Where it all began",
    "11",
    "5",
    "Demo",
    "iPhone11",
    "UltraWideSkate"
];

for (const keyStr of meaningfulKeys) {
    const key = Buffer.from(keyStr);
    const result = Buffer.alloc(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        result[i] = decoded[i] ^ key[i % key.length];
    }
    const str = result.toString('utf8');
    let printable = 0;
    for (let i = 0; i < result.length; i++) {
        if (result[i] >= 32 && result[i] <= 126) {
            printable++;
        }
    }
    const ratio = printable / result.length;
    if (ratio > 0.5) {
        console.log(`Key "${keyStr}": ${str.substring(0, 60)}... (${Math.round(ratio*100)}% printable)`);
        if (ratio > 0.8) {
            console.log(`  FULL: "${str}"`);
        }
    }
}

// Try XOR with reversed keys
console.log("\n=== Trying reversed meaningful keys ===");
for (const keyStr of meaningfulKeys) {
    const reversed = keyStr.split('').reverse().join('');
    const key = Buffer.from(reversed);
    const result = Buffer.alloc(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
        result[i] = decoded[i] ^ key[i % key.length];
    }
    const str = result.toString('utf8');
    let printable = 0;
    for (let i = 0; i < result.length; i++) {
        if (result[i] >= 32 && result[i] <= 126) {
            printable++;
        }
    }
    const ratio = printable / result.length;
    if (ratio > 0.5) {
        console.log(`Reversed key "${reversed}": ${str.substring(0, 60)}... (${Math.round(ratio*100)}% printable)`);
    }
}
