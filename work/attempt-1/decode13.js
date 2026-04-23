// Let me try keyboard-based cipher or QWERTY shift

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

const decoded = rot47(line1);
console.log("Current decoded:", decoded);

// Maybe it's QWERTY shift - shift each letter to the next key on QWERTY keyboard
console.log("\n=== QWERTY shift ===");
const qwertyRows = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm"
];

function qwertyShift(str, shift) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str[i].toLowerCase();
        let found = false;
        for (const row of qwertyRows) {
            const pos = row.indexOf(c);
            if (pos >= 0) {
                const newPos = (pos + shift + row.length) % row.length;
                const newChar = row[newPos];
                // Preserve case
                result += str[i] === c ? newChar : (str[i] === c.toUpperCase() ? newChar.toUpperCase() : c);
                found = true;
                break;
            }
        }
        if (!found) result += str[i];
    }
    return result;
}

for (let i = 1; i <= 3; i++) {
    console.log(`Shift ${i}:`, qwertyShift(decoded, i).substring(0, 60));
}

// Maybe it's binary reversed?
console.log("\n=== Try binary to decimal to char ===");
const b64 = Buffer.from(line1, 'base64');
const asBinary = Array.from(b64).map(b => b.toString(2).padStart(8, '0')).join('');
console.log("Binary string:", asBinary.substring(0, 100));

// Now interpret that binary string differently - maybe it's decimal?
const asDecimal = Array.from(b64).join(' ');
console.log("As decimal string:", asDecimal);

// Wait - maybe the entire thing is just a direct string after some cipher
// Let's try just a simple ASCII offset for all chars in line1
console.log("\n=== Simple offset from ASCII 47 ===");
// Maybe line1 was encoded by using ASCII - 47 = what?
console.log("Original char codes:", line1.substring(0, 10).charCodeAt(0));

// Try each offset 1-127
for (let offset = 1; offset < 127; offset++) {
    let res = "";
    for (let i = 0; i < line1.length; i++) {
        const code = line1.charCodeAt(i);
        if (code >= 33 && code <= 126) {
            const newCode = ((code - 33 - offset + 94) % 94) + 33;
            res += String.fromCharCode(newCode);
        } else {
            res += line1[i];
        }
    }
    if (res.toLowerCase().includes("the ") && res.length > 50) {
        console.log(`Offset ${offset}:`, res.substring(0, 60));
    }
}