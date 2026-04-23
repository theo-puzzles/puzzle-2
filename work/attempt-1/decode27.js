// Simpler: Steps 3-5 might be selection or transformation

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
const step2 = rot47(line1);

// Maybe need to convert step2 (ASCII codes) to hex, interpret as key, then use to decrypt original
console.log("=== Step 3: Convert step2 to hex, use as key ===");
const step2hex = step2.split('').map(c => c.charCodeAt(0).toString(16)).join('');
console.log("Step2 hex:", step2hex.substring(0, 40));

// Use some of the hex as key
const keyBytes = step2hex.substring(0, 16).match(/.{1,2}/g) || [];
const keyNums = keyBytes.map(h => parseInt(h, 16) || 0);

// Apply to original base64
const orig = Buffer.from(line1, 'base64');
let result = "";
for (let i = 0; i < orig.length; i++) {
    const keyByte = keyNums[i % keyNums.length];
    result += String.fromCharCode(orig[i] ^ keyByte);
}
console.log("XOR result:", result);

// What if step 2 gives us something we should use as a decoding key in another layer?
// Or maybe step 3 is simpler: just read characters in a different order

console.log("\n=== Step 3: Various reads ===");
// 1. Forward only (what we have)
// 2. Reverse
console.log("Reversed:", step2.split('').reverse().join(''));

// 3. ASCII sort
console.log("Sorted:", step2.split('').sort().join(''));

// 4. Remove duplicates while preserving order
let uniq = "";
const seen = new Set();
for (const c of step2) {
    if (!seen.has(c)) {
        seen.add(c);
        uniq += c;
    }
}
console.log("Deduplicated:", uniq);

// 5. Only keep certain char types
console.log("Only letters:", step2.replace(/[^a-zA-Z]/g, ''));
console.log("Only numbers:", step2.replace(/[^0-9]/g, ''));
console.log("Only special:", step2.replace(/[a-zA-Z0-9]/g, ''));

// 6. Shift characters in some pattern based on positions
console.log("\n=== Step 4: Alternating shifts ===");
let altShift = "";
for (let i = 0; i < step2.length; i++) {
    const c = step2.charCodeAt(i);
    if (i % 2 === 0) {
        // Shift forward
        altShift += ((c - 33 + 1) % 94) + 33;
    } else {
        // Shift backward
        altShift += ((c - 33 - 1 + 94) % 94) + 33;
    }
}
console.log("Alt shift:", altShift);

// Wait - maybe it's that simple step 3 is just ROT47 decode on ORIGINAL string first, then do something else?
// What if I misidentified step 1 and 2? Let's recompute from scratch
console.log("\n=== Verify step numbers ===");
// The HINT line decodes with ROT47 - that's step 2
// So step 2 = ROT47 definitely
// Step 1 might not be base64 - maybe it's something else that gives us a step 1 result to then apply ROT47 to

// Check: does the hint line have ANY other simple decode that makes sense?
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";
console.log("line2 raw:", line2);
// If ROT47 is step2, step1 of line2 might be raw input OR something else