// "A drum break might shatter it!" - let's try these words as keys
// drum, break, drumbreak, beat, shatter

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

// After ROT47
const decodedROT = rot47(line1);

// Try different word keys
const keys = ["drum", "break", "drumbreak", "beat", "shatter", "drum break", "skate", "iphone", "ultra", "wide", "camera", "begin", "started"];

console.log("=== Try word keys (XOR) on ROT47 result ===");
for (const key of keys) {
    let result = "";
    for (let i = 0; i < decodedROT.length; i++) {
        const code = decodedROT.charCodeAt(i);
        const keyCode = key.charCodeAt(i % key.length);
        const xorResult = code ^ keyCode;
        if (xorResult >= 32 && xorResult <= 126) {
            result += String.fromCharCode(xorResult);
        }
    }
    if (result.toLowerCase().includes("the ") || result.includes("http") || result.includes("www")) {
        console.log(`Key "${key}":`, result);
    }
}

// Wait - maybe it uses the video content itself?? The video is "Skate Footage"
// What if we try 'skate' or 'footage' as keys or extract frames?

// But maybe we are supposed to extract something from the YouTube video? This seems too complex.

// Let me think: What if this is NOT meant to be solved by me but by someone 
// who searches and watches the video for clues?

// The hint "A drum break might shatter it!" could mean: 
// - Use "drum break" as cipher key (like 432 Hz frequency?)
// - Or use something from video that has drums/beats

// For a simpler approach, let me try just interpreting as plain text with offsets:
console.log("\n=== Try simple shift operations ===");
// Try subtract offset 5-50 on ROT47 decoded
for (let off = 5; off <= 50; off += 5) {
    let result = "";
    for (let i = 0; i < decodedROT.length; i++) {
        const c = decodedROT.charCodeAt(i);
        if (c >= 33 && c <= 126) {
            const newC = ((c - 33 - off + 94) % 94) + 33;
            result += String.fromCharCode(newC);
        } else {
            result += decodedROT[i];
        }
    }
    if (result.includes("the ") || result.includes("http") || result.includes("puzzle")) {
        console.log(`Subtract ${off}:`, result.substring(0, 60));
    }
}

// Actually, maybe it's multiple encoding layers (base64 + ROT47 + something else)
// We know ROT47 seems correct for line2
// Could line1 use ROT47 + something else like:
console.log("\n=== Try ROT47 + ROT13 combo ===");
function rot13(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 65 && c <= 90) result += String.fromCharCode(((c - 65 + 13) % 26) + 65);
        else if (c >= 97 && c <= 122) result += String.fromCharCode(((c - 97 + 13) % 26) + 97);
        else result += str[i];
    }
    return result;
}

// Try different combinations
const combos = [
    ["ROT47 only", decodedROT],
    ["ROT47 + ROT13", rot13(decodedROT)],
    ["ROT47 + ROT13 + ROT47", rot47(rot13(decodedROT))],
    ["ROT13 + ROT47", rot47(rot13(line1))],
];

for (const [name, result] of combos) {
    console.log(`${name}:`, result.toString().substring(0, 60));
}

console.log("\n=== Final guess: maybe try base91? ===");
// Base91 is a rare encoding but uses more chars than base64
// Maybe we can just look at what's printable

// Wait! The puzzle uses '/r' at start - could be reddit!
console.log("\n=== Is it a Reddit URL? ===");
// If /r/ = reddit.com/r/
const possible = "r/" + decodedROT.substring(0, 8);
console.log("Could be:", possible);