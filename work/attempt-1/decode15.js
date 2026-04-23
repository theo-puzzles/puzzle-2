// Let me test if combining ROT47 + ROT13 gives us something

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

function rot13(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode(((c - 65 + 13) % 26) + 65);
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode(((c - 97 + 13) % 26) + 97);
        } else {
            result += str[i];
        }
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// Try ROT47 then ROT13
console.log("=== ROT47 then ROT13 ===");
console.log(rot13(rot47(line1)).substring(0, 60));

// Try ROT13 then ROT47
console.log("=== ROT13 then ROT47 ===");
console.log(rot47(rot13(line1)).substring(0, 60));

// Check original with ROT47 twice on just letters
console.log("\n=== Just do ROT47 twice (full cycle) ===");
console.log(rot47(rot47(line1)));

// What if there's something in the string length - 100 chars, could be divided differently
const decoded = rot47(line1);
console.log("\n=== Length:", decoded.length);
// Could be 10x10 or other divisors
const len = decoded.length;
// Try divisors
const divisors = [2, 4, 5, 10, 20, 25, 50];
for (const d of divisors) {
    if (len % d === 0) {
        console.log(`Can divide by ${d}: ${len/d} x ${d}`);
    }
}

// Actually 100 = 10 x 10 - try as grid reading diagonal
console.log("\n=== Diagonal read from grid ===");
for (let size = 10; size <= 10; size++) {
    let diag = "";
    for (let i = 0; i < decoded.length; i += size + 1) {
        diag += decoded[i];
    }
    console.log(`Diagonal ${size}x${size}:`, diag);
}

// Maybe it's a transposition - let's interleave with line2 decoded
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";
const dec2 = rot47(line2);
const dec1 = decoded;

console.log("\n=== Interleave both ===");
let merged = "";
for (let i = 0; i < Math.max(dec1.length, dec2.length); i++) {
    if (i < dec1.length) merged += dec1[i];
    if (i < dec2.length) merged += dec2[i];
}
console.log("Merged:", merged.substring(0, 70));

// Wait - maybe we can try to interpret as Morse code
console.log("\n=== Morse/Tap code ===");
// Too many special chars likely not Morse

// Let's check common puzzle phrases - maybe "the answer is" or something embedded
// Look for ASCII art or patterns
console.log("\n=== Check for patterns ===");
// Find any substring that repeats
const subs = {};
for (let i = 0; i < decoded.length - 3; i++) {
    const sub = decoded.substring(i, i + 4);
    subs[sub] = (subs[sub] || 0) + 1;
}
const repeats = Object.entries(subs).filter(([k, v]) => v > 1);
console.log("Repeating 4-chars:", repeats.length > 0 ? repeats : "none");