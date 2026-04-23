// Let me try ROT13 and try other letter shifts

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

// Try ROT13
console.log("=== ROT13 ===");
console.log(rot13(line1));

console.log("\n=== ROT5 (digits only) ===");
// ROT5 for digits
function rot5(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c >= 48 && c <= 57) {
            result += String.fromCharCode(((c - 48 + 5) % 10) + 48);
        } else {
            result += str[i];
        }
    }
    return result;
}
console.log(rot5(line1));

console.log("\n=== Combined ROT5 + ROT13 ===");
console.log(rot13(rot5(line1)));

console.log("\n=== Look at character pattern ===");
// What if it's reversed and then ROT47?
const reversed = line1.split('').reverse().join('');
console.log("Reversed:", reversed);
console.log("Reversed ROT47:", rot47(reversed));

// Wait - what about "A drum break" - what if that means "break the drum" = break the circle?
// In crypto, "breaking" a ring or cycle might refer to something specific

// Maybe the answer is simpler - maybe we need to look at /r/ which is Reddit prefix
// /rRo could be /r/Ro (Reddit Ro?)
// Or maybe it's url encoded

// Let me try URL decoding on the ROT47 result
console.log("\n=== URL decode the ROT47 result ===");
const rot47decoded = rot47(line1);
try {
    console.log(decodeURIComponent(rot47decoded));
} catch(e) {
    console.log("Error:", e.message);
}

// Try different ROT values - maybe not 47
for (let r = 1; r < 100; r++) {
    function rotN(str, n) {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode >= 33 && charCode <= 126) {
                let decoded = ((charCode - 33 + n) % (126 - 33 + 1)) + 33;
                result += String.fromCharCode(decoded);
            } else {
                result += str[i];
            }
        }
        return result;
    }
    const res = rotN(line1, r);
    if (res.toLowerCase().includes("http") || res.includes("www") || res.toLowerCase().includes("the ") || res.toLowerCase().includes("puzzle")) {
        console.log(`ROT${r}:`, res.substring(0, 60));
    }
}