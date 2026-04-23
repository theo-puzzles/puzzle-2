// Let's try multiple sequential rotations - if step 3 is another rotation that we haven't found

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

function rot5(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 48 && c <= 57) { // digits
            result += String.fromCharCode(((c - 48 + 5) % 10) + 48);
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
        if (c >= 65 && c <= 90) result += String.fromCharCode(((c - 65 + 13) % 26) + 65);
        else if (c >= 97 && c <= 122) result += String.fromCharCode(((c - 97 + 13) % 26) + 97);
        else result += str[i];
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

// After step2 (ROT47)
const step2 = rot47(line1);

// Try combinations of ROTs in different orders on step2
console.log("=== Various sequential rotation combos on step2 ===");
const combos = [
    ["step2 only (ROT47)", step2],
    ["+ ROT13", rot13(step2)],
    ["+ ROT5", rot5(step2)],
    ["+ ROT13 + ROT5", rot5(rot13(step2))],
    ["+ ROT5 + ROT13", rot13(rot5(step2))],
    ["+ ROT47 + ROT13", rot13(step2)], // applying another ROT47 gives original (cycle)
    ["+ ROT47 + ROT13 + ROT5", rot5(rot13(step2))],
    ["+ ROT5 x3 (digit shifts)", rot5(rot5(rot5(step2)))],
];

for (const [name, result] of combos) {
    // Only print if contains something promising
    if (result.toLowerCase().includes("http") || result.toLowerCase().includes("the ") || result.toLowerCase().includes("puzzle") || result.toLowerCase().includes("answer")) {
        console.log(name + ":", result.substring(0, 60));
    }
}

// Actually let's just print everything to see patterns
console.log("\n=== Print all combos ===");
for (const [name, result] of combos) {
    console.log(name + ":", result.substring(0, 50));
}

// Maybe it's simple: just apply ROT5 to step2 results because we see the digit '2' in step2
console.log("\n=== Check what's the digit situation ===");
const digits = step2.match(/[0-9]/g);
console.log("Digits in step2:", digits);

// If we shift those digits by ROT5 (5 positions up), we get different values
// For step 2 we see '2' and there's also numbers in positions at others

const digitShift = step2.replace(/[0-9]/g, d => {
    return String.fromCharCode(((parseInt(d) + 5) % 10) + 48);
});
console.log("After shifting digits:", digitShift);