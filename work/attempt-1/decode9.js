// Let me step back and think about this puzzle more holistically
// The puzzle has TWO lines - maybe they relate to each other

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

// The hint says "A drum break might shatter it!"
// What if we use these to interact in some way?

// Let me try XOR of the decoded forms
const dec1 = rot47(line1);
const dec2 = rot47(line2);

console.log("=== XOR of both decoded lines ===");
// XOR byte by byte
for (let i = 0; i < Math.max(dec1.length, dec2.length); i++) {
    const c1 = i < dec1.length ? dec1.charCodeAt(i) : 0;
    const c2 = i < dec2.length ? dec2.charCodeAt(i) : 0;
    const xor = c1 ^ c2;
    if (xor >= 32 && xor <= 126) {
        process.stdout.write(String.fromCharCode(xor));
    }
}
console.log();

// What about concatenating and then decoding?
console.log("\n=== Try combined operations ===");
// Try: take line2 ROT47 decoded, use as key to decode line1
const combined = dec1 + dec2;
console.log("Combined length:", combined.length);

// Try different positions
console.log("\n=== Try looking for key embedded in line2 ===");
// Extract the video URL part and use it as key
const videoKey = "0mpxB5iVQ";
const key2 = "N_0mpxB5iVQ";

// Try using these as keys
function decodeWithKey(str, key) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        const k = key.charCodeAt(i % key.length);
        const decoded = c ^ k; // XOR
        if (decoded >= 32 && decoded <= 126) {
            result += String.fromCharCode(decoded);
        }
    }
    return result;
}

console.log("XOR with videoKey:", decodeWithKey(dec1, videoKey));
console.log("XOR with key2:", decodeWithKey(dec1, key2));

// What if it's just adding line1 + line2 as numbers?
console.log("\n=== Try addition ===");
let addResult = "";
for (let i = 0; i < Math.min(dec1.length, dec2.length); i++) {
    const val = (dec1.charCodeAt(i) + dec2.charCodeAt(i)) % 128;
    if (val >= 32) {
        addResult += String.fromCharCode(val);
    }
}
console.log("Add result:", addResult);