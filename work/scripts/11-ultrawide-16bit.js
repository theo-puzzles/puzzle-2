const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const decoded = Buffer.from(line1, 'base64');

console.log("Decoded hex:", decoded.toString('hex'));
console.log("Decoded length:", decoded.length, "bytes");

// "UltraWide" might hint at 16-bit (2 bytes per char instead of 1)
// Try reading as 16-bit big-endian integers
console.log("\n=== Treating as 16-bit values (big-endian) ===");
const u16be = [];
for (let i = 0; i < decoded.length - 1; i += 2) {
    u16be.push(decoded.readUInt16BE(i));
}
console.log("16-bit BE values:", u16be.map(v => v.toString(16)).join(' '));

// Try ROT47 on 16-bit values (add 47*256 to each?)
const rot47_16bit = u16be.map(v => {
    const hi = (v >> 8) & 0xFF;
    const lo = v & 0xFF;
    const newHi = (hi >= 33 && hi <= 126) ? (33 + ((hi - 33 + 47) % 94)) : hi;
    const newLo = (lo >= 33 && lo <= 126) ? (33 + ((lo - 33 + 47) % 94)) : lo;
    return (newHi << 8) | newLo;
});
console.log("After ROT47 on 16-bit:", rot47_16bit.map(v => v.toString(16)).join(' '));
const rot47bytes = Buffer.from(new Uint16Array(rot47_16bit).buffer);
console.log("As string:", rot47bytes.toString('utf8'));

// Try XOR with "UltraWide" as 16-bit
console.log("\n=== XOR with 'UltraWide' as 16-bit ===");
const key16 = Buffer.from('UltraWide', 'utf16le'); // Little-endian UTF-16
console.log("Key bytes:", key16.toString('hex'));

// Maybe try AES or other crypto?
// Let me try a simple approach: what if the "5 steps" are:
// 1. Base64 decode
// 2. Something with the video ID
// 3. ??? (the hard step)
// 4. ???
// 5. Plaintext

// Let me try: XOR with the video ID bytes treated as 16-bit
const videoId = "N_0mpxB5iVQ";
const videoIdBuf = Buffer.from(videoId);
console.log("\n=== XOR with video ID repeated ===");
const result = Buffer.alloc(decoded.length);
for (let i = 0; i < decoded.length; i++) {
    result[i] = decoded[i] ^ videoIdBuf[i % videoIdBuf.length];
}
console.log("XOR with video ID:", result.toString('utf8'));
console.log("Hex:", result.toString('hex'));

// What if we need to reverse the bytes first?
console.log("\n=== Reverse bytes, then XOR ===");
const reversed = Buffer.from([...decoded].reverse());
const result2 = Buffer.alloc(reversed.length);
for (let i = 0; i < reversed.length; i++) {
    result2[i] = reversed[i] ^ videoIdBuf[i % videoIdBuf.length];
}
console.log("Reversed XOR video ID:", result2.toString('utf8'));

// What about XOR with "iPhone 11 UltraWide"?
const keyLong = "iPhone 11 UltraWide Skate Footage Demo";
const keyLongBuf = Buffer.from(keyLong);
console.log("\n=== XOR with full phrase ===");
const result3 = Buffer.alloc(decoded.length);
for (let i = 0; i < decoded.length; i++) {
    result3[i] = decoded[i] ^ keyLongBuf[i % keyLongBuf.length];
}
console.log("XOR with full phrase:", result3.toString('utf8'));
console.log("Hex:", result3.toString('hex'));
