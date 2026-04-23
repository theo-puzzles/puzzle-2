// Puzzle 2 Analysis
// Line 1: /rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=
// Line 2 (hint): (96C6 :E 2== 3682}0_>AIqd:'"
// Hint decodes to: Where it all begaN_0mpxB5iVQ -> YouTube video

console.log("=== PUZZLE 2 ANALYSIS ===\n");

// Let's try to understand the encoding
const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

// Let's see character by character what might be transformation
console.log("Line1 length:", line1.length);
console.log("Line2 length:", line2.length);

// Let's check if it's a simple substitution cipher
// Hint says "A drum break might shatter it!" - might be related to breaking/caesar

// Let's try decoding as base64 first
try {
    const decoded = Buffer.from(line1, 'base64').toString('utf8');
    console.log("Base64 decode line1:", decoded);
} catch(e) {
    console.log("Base64 decode failed");
}

try {
    const decoded2 = Buffer.from(line2, 'base64').toString('utf8');
    console.log("Base64 decode line2:", decoded2);
} catch(e) {
    console.log("Base64 decode line2 failed");
}

// The hint line decodes to "Where it all begaN_0mpxB5iVQ"
// Let's see if we can find transformation between line2 chars and the decoded hint
const target = "Where it all begaN_0mpxB5iVQ";
console.log("\nChar analysis of hint line:");
for (let i = 0; i < line2.length && i < target.length; i++) {
    console.log(`${line2[i]} (${line2.charCodeAt(i)}) -> ${target[i]} (${target.charCodeAt(i)}) diff: ${target.charCodeAt(i) - line2.charCodeAt(i)}`);
}