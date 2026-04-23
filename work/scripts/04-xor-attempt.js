const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Decoded bytes length:", decoded.length);
console.log("As hex:", decoded.toString('hex'));

// Try XOR with different keys
function xorBuffer(buffer, key) {
    const keyBytes = Buffer.from(key);
    const result = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        result[i] = buffer[i] ^ keyBytes[i % keyBytes.length];
    }
    return result;
}

// Try XOR with "iPhone 11" 
const key1 = "iPhone 11";
const result1 = xorBuffer(decoded, key1);
console.log("\nXOR with 'iPhone 11':", result1.toString('utf8'));
console.log("Hex:", result1.toString('hex'));

// Try XOR with "UltraWide"
const key2 = "UltraWide";
const result2 = xorBuffer(decoded, key2);
console.log("\nXOR with 'UltraWide':", result2.toString('utf8'));
console.log("Hex:", result2.toString('hex'));

// Try XOR with video ID "N_0mpxB5iVQ"
const key3 = "N_0mpxB5iVQ";
const result3 = xorBuffer(decoded, key3);
console.log("\nXOR with 'N_0mpxB5iVQ':", result3.toString('utf8'));
console.log("Hex:", result3.toString('hex'));

// Try XOR with "Where it all began"
const key4 = "Where it all began";
const result4 = xorBuffer(decoded, key4);
console.log("\nXOR with 'Where it all began':", result4.toString('utf8'));
console.log("Hex:", result4.toString('hex'));
