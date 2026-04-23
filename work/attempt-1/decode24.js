// Step 3: Try alternating positions - transform every other character

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

// Step 2
const step2 = rot47(line1);

// Step 3: Try ROT47 only on positions 0,2,4,6... (even indices)
console.log("=== Step3: Alternating ROT47 decode ===");
let alt = "";
for (let i = 0; i < step2.length; i++) {
    const c = step2.charCodeAt(i);
    if (i % 2 === 0) {
        // Apply ROT47
        if (c >= 33 && c <= 126) {
            const decoded = ((c - 33 + 47) % (126 - 33 + 1)) + 33;
            alt += String.fromCharCode(decoded);
        } else {
            alt += step2[i];
        }
    } else {
        alt += step2[i];
    }
}
console.log("Every even pos:", alt);

// Try on odd positions
let alt2 = "";
for (let i = 0; i < step2.length; i++) {
    const c = step2.charCodeAt(i);
    if (i % 2 === 1) {
        if (c >= 33 && c <= 126) {
            const decoded = ((c - 33 + 47) % (126 - 33 + 1)) + 33;
            alt2 += String.fromCharCode(decoded);
        } else {
            alt2 += step2[i];
        }
    } else {
        alt2 += step2[i];
    }
}
console.log("Every odd pos:", alt2);

// Step 4: Try splitting into 2 halves and swapping
console.log("\n=== Step4: Swap halves ===");
const mid = Math.floor(step2.length / 2);
const swapped = step2.substring(mid) + step2.substring(0, mid);
console.log("Swapped:", swapped);

// Step 5: Different interpretations
// Could we have misidentified step 2?
// What if line1 isn't ROT47 at all but something else gives step 1?
console.log("\n=== Check other potential step1 results ===");
// Try ROT1 on line1 - simple shift by 1
let rot1 = "";
for (let i = 0; i < line1.length; i++) {
    const c = line1.charCodeAt(i);
    if (c >= 33 && c <= 126) {
        const shifted = ((c - 33 + 1) % (126 - 33 + 1)) + 33;
        rot1 += String.fromCharCode(shifted);
    } else {
        rot1 += line1[i];
    }
}
console.log("ROT1:", rot1);

// Try ROT5 (shifts digits only)
let rot5 = "";
for (let i = 0; i < line1.length; i++) {
    const c = line1.charCodeAt(i);
    if (c >= 48 && c <= 57) {
        rot5 += String.fromCharCode(((c - 48 + 5) % 10) + 48);
    } else {
        rot5 += line1[i];
    }
}
console.log("ROT5:", rot5);

// What if STEP 1 is actually just leaving it as is (line1 is step 1)?
// Step2 = ROT47, Step3 = ...
console.log("\n=== If step1 is just raw line1 ===");
console.log("line1 is:", line1.substring(0, 50));

// Let me try different starting points - maybe step 1 needs a key
console.log("\n=== If step1 requires key from line2 ===");
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";
const hint = rot47(line2);
console.log("Hint:", hint);

// Use some portion of hint as key for transforming line1
// Use "drum" (first 4 chars of break key?)
const key = "drum";
let result = "";
for (let i = 0; i < line1.length; i++) {
    const c = line1.charCodeAt(i);
    const k = key.charCodeAt(i % key.length);
    if (c >= 33 && c <= 126) {
        const shifted = ((c - 33 - k + 94) % 94) + 33;
        result += String.fromCharCode(shifted);
    } else {
        result += line1[i];
    }
}
console.log("XOR with drum key:", result);