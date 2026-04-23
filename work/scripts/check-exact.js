const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

// Let me verify exact string matching
const rot47 = (s) => s.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(33 + ((code - 33 + 47) % 94));
    return c;
}).join('');

const decoded2 = rot47(line2);
console.log("Line 2 decoded:", JSON.stringify(decoded2));
console.log("Expected:", JSON.stringify("Where it all begaN_0mpxB5iVQ"));
console.log("Match:", decoded2 === "Where it all begaN_0mpxB5iVQ");

// The issue: line2 ends with '":'
// Let me check raw characters
console.log("\nRaw comparison:");
console.log("line2:", line2.split('').map(c => c.charCodeAt(0)));
console.log("expected:", "Where it all begaN_0mpxB5iVQ".split('').map(c => c.charCodeAt(0)));

// There's a mismatch at the end!
// line2 ends with '"' (34) and ':' (44?) actually look:
// Let me re-escape

const correctHint = "Where it all begaN_0mpxB5iVQ";
console.log("\nCorrect hint chars:", JSON.stringify(correctHint));
console.log("\nLine 2 chars at end:", JSON.stringify(line2.slice(-6));