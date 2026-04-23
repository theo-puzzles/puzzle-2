// Let me try key-repeating operations more systematically

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
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

// Decode both with ROT47 first
const dec1 = rot47(line1);
const dec2 = rot47(line2);

console.log("Line1 ROT47:", dec1);
console.log("Line2 ROT47:", dec2);

// Maybe we need to do more transforms - try each byte + some operation using line2 as key
// Try adding charcodes
console.log("\n=== Add char codes ===");
let addResult = "";
for (let i = 0; i < dec1.length; i++) {
    const code1 = dec1.charCodeAt(i);
    const code2 = dec2.charCodeAt(i % dec2.length);
    const sum = ((code1 + code2 - 64) % 94) + 33;
    addResult += String.fromCharCode(sum);
}
console.log(addResult.substring(0, 60));

// Try subtract
console.log("\n=== Subtract char codes ===");
let subResult = "";
for (let i = 0; i < dec1.length; i++) {
    const code1 = dec1.charCodeAt(i);
    const code2 = dec2.charCodeAt(i % dec2.length);
    const diff = ((code1 - code2 - 1) % 94);
    const final = diff < 33 ? diff + 94 : diff + 33 < 33 ? diff + 66 : diff + 33;
    subResult += String.fromCharCode(final);
}
console.log(subResult.substring(0, 60));

// Maybe the order is different - maybe line2 gives instruction on how to decode
// The hint after ROT47 is: "Where it all begaN_0mpxB5iVQ"
// Wait - maybe this tells us WHAT to do, not just a video
// "Where it all began" - where WHAT began?

// What if the video ID "N_0mpxB5iVQ" has meaning as key?
// Try that as a decryption key
console.log("\n=== Try video ID N_0mpxB5iVQ as key ===");
const videoKey = "N_0mpxB5iVQ";
let result1 = "";
for (let i = 0; i < dec1.length; i++) {
    const code1 = dec1.charCodeAt(i);
    const keyChar = videoKey.charCodeAt(i % videoKey.length);
    const xor = code1 ^ keyChar;
    if (xor >= 33 && xor <= 126) {
        result1 += String.fromCharCode(xor);
    } else {
        result1 += String.fromCharCode(((xor % 94) + 33));
    }
}
console.log(result1);

// Try "drum" as key
console.log("\n=== Try 'drum' as key ===");
let result2 = "";
for (let i = 0; i < dec1.length; i++) {
    const code1 = dec1.charCodeAt(i);
    const keyChar = "drum".charCodeAt(i % 4);
    const xor = code1 ^ keyChar;
    const final = ((xor - 33 + 94) % 94) + 33;
    result2 += String.fromCharCode(final);
}
console.log(result2);

// Wait - the puzzle actually gave us hint that doesn't work the same way
// Maybe we need to interpret line2 differently - not ROT47 
// But actually we already verified line2 is ROT47 encoded 
// Which means line1 probably requires something else on top

// Actually, what if BOTH use ROT47?
// And then we compare/merge them?
// We already tried that...

// Maybe it's just: base64 decode first, then apply rotation, then XOR
console.log("\n=== Try base64 then XOR with key ===");
const b64data = Buffer.from(line1, 'base64');
const keys = ["drum", "drumbreak", "break", "apple", "iphone"];
for (const key of keys) {
    let res = "";
    for (let i = 0; i < b64data.length; i++) {
        const byte = b64data[i];
        const keyByte = key.charCodeAt(i % key.length);
        const decrypted = byte ^ keyByte;
        if (decrypted >= 32 && decrypted <= 126) {
            res += String.fromCharCode(decrypted);
        }
    }
    if (res.toLowerCase().includes("the") || res.includes("http")) {
        console.log(`Key "${key}":`, res.substring(0, 60));
    }
}