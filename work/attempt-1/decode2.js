// Try different combinations of encoding for line1

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

console.log("=== Attempt 1: Base64 first, then ROT47 ===");
try {
    const step1 = Buffer.from(line1, 'base64').toString('utf8');
    console.log("After base64:", step1);
    const step2 = rot47(step1);
    console.log("After ROT47:", step2);
} catch(e) {
    console.log("Failed:", e.message);
}

console.log("\n=== Attempt 2: ROT47 first, then base64 ===");
try {
    const step1 = rot47(line1);
    console.log("After ROT47:", step1);
    const step2 = Buffer.from(step1, 'base64').toString('utf8');
    console.log("After base64:", step2);
} catch(e) {
    console.log("Failed:", e.message);
}

console.log("\n=== Attempt 3: Just base64 ===");
try {
    const decoded = Buffer.from(line1, 'base64').toString('utf8');
    console.log("Base64 only:", decoded);
} catch(e) {
    console.log("Failed");
}

// Look at character distributions
console.log("\n=== Character analysis of encoded line1 ===");
const chars = {};
for (const c of line1) {
    chars[c] = (chars[c] || 0) + 1;
}
console.log(chars);

// Check if ends with = padding, looks like base64
console.log("\n=== Look for patterns ===");
// Remove padding and analyze
const clean = line1.replace(/=/g, '');
console.log("Length without padding:", clean.length);
console.log("Is valid base64 chars?", /^[/A-Za-z0-9]+$/.test(clean));