// Let me try reading step2 as specific character ranges only

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

// What if step 3 is: apply ROT47 again, then ALSO something like shifting each char position
// Actually, ROT47 x2 gives back line1! So that can't be it

// Let me think - maybe we misunderstood step 2. What if step 2 involves BOTH lines?
console.log("=== Step 2: Combine line1 and line2 ===");
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";
const step2_line2 = rot47(line2);

// Try XOR two step2 results together
let xorCombined = "";
for (let i = 0; i < Math.max(step2.length, step2_line2.length); i++) {
    const c1 = i < step2.length ? step2.charCodeAt(i) : 0;
    const c2 = i < step2_line2.length ? step2_line2.charCodeAt(i) : 0;
    xorCombined += String.fromCharCode(c1 ^ c2);
}
console.log("XOR of both:", xorCombined);

// Add them instead
let addCombined = "";
for (let i = 0; i < Math.max(step2.length, step2_line2.length); i++) {
    const c1 = i < step2.length ? step2.charCodeAt(i) : 33;
    const c2 = i < step2_line2.length ? step2_line2.charCodeAt(i) : 33;
    const sum = ((c1 + c2 - 66) % 94) + 33;
    addCombined += String.fromCharCode(sum);
}
console.log("Add:", addCombined);

// What if step 3 requires extracting something from step2?
// Like every Nth character
console.log("\n=== Step 3: Extract patterns ===");
// Every 3rd from step2
let every3 = "";
for (let i = 0; i < step2.length; i += 3) {
    every3 += step2[i];
}
console.log("Every 3rd:", every3);

// Every 5th
let every5 = "";
for (let i = 0; i < step2.length; i += 5) {
    every5 += step2[i];
}
console.log("Every 5th:", every5);

// Read groups of 3 chars
console.log("\n=== Step 4: Group reads ===");
const groups3 = step2.match(/.{3}/g) || [];
console.log("Groups of 3:", groups3.slice(0, 10));

// Map each group to something (like decimal)
let groupNums = groups3.map(g => {
    let num = 0;
    for (let i = 0; i < g.length; i++) {
        num = num * 94 + (g.charCodeAt(i) - 33);
    }
    return num;
});
console.log("As base94 numbers:", groupNums.slice(0, 10));

// Convert those numbers to something else (like decimal string)
console.log("As decimal string:", groupNums.join('').substring(0, 60));

// But can we do anything else with these?
// For step 5, maybe we need to convert this to some known format
// These could be ASCII codes - let's see
let asciiFromNums = groupNums.map(n => n >= 32 && n <= 126 ? String.fromCharCode(n) : '?').join('');
console.log("Numbers as ASCII:", asciiFromNums);