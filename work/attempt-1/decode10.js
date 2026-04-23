// Maybe it's password protected with "drum break" or some variation

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

// Try password-based decoding - first ROT47 then use password
// Actually maybe it's AES encryption?
// Let me check if there's an 'S' at the start which could mean AES (like OpenSSL format)

// OpenSSL uses salt in format Salted__ + 8 bytes salt + encrypted data
// Let's see if it starts with "Salted__"
console.log("=== Check for OpenSSL format ===");
if (line1.startsWith("Salted__")) {
    console.log("Looks like OpenSSL encrypted data");
} else {
    console.log("Not OpenSSL format");
}

// Try some known encodings
// Let's see what the result looks like as a simple substitution
// Try A=1, B=2 etc
const decoded = rot47(line1);
const shifted = decoded.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) {
        // Try subtracting some offset
        const newCode = code - 5;
        if (newCode >= 33) return String.fromCharCode(newCode);
    }
    return c;
}).join('');
console.log("\n=== Shift -5 after ROT47 ===");
console.log(shifted);

// Try looking for the YouTube pattern in result
// The video ID is N_0mpxB5iVQ which has pattern N_
console.log("\n=== Search for patterns ===");
console.log("Contains N_:", decoded.includes("N_"));
console.log("Contains _:", decoded.includes("_"));
console.log("Contains 0m:", decoded.includes("0m"));

// Maybe it's just a URL with query params
// Let's try parsing as URL params
const queryStart = decoded.indexOf('?');
if (queryStart >= 0) {
    console.log("\n=== Try as URL ===");
    const query = decoded.substring(queryStart);
    try {
        const params = new URLSearchParams(query);
        console.log(params.toString());
    } catch(e) {}
}

// What about reading it as binary and interpreting in different encodings
console.log("\n=== Try interpreting as different encodings ===");
// Let's treat the ROT47ed version as if it could be Morse code or similar

// Let me try something different - maybe it's base91 or something unusual
// Check character range
const chars = decoded.split('').map(c => c.charCodeAt(0));
const min = Math.min(...chars);
const max = Math.max(...chars);
console.log("Char range:", min, "to", max);

// Try checking if result looks like it contains words
// Use a wordlist approach
const wordMatches = ["the", "and", "puzzle", "answer", "hint", "code", "crypto", "cipher", "solve", "key", "password", "secret", "encrypt", "decrypt"];
for (const word of wordMatches) {
    if (decoded.toLowerCase().includes(word)) {
        console.log("Contains:", word);
    }
}

// Try different starting shift values 
// Maybe we need to shift by 'key' characters from hint
console.log("\n=== Try shifting by positions in hint ===");
const hintChars = "drum break".split('');
for (let shift = 1; shift <= 20; shift++) {
    const result2 = decoded.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 33 && code <= 126) {
            const newCode = ((code - 33 - shift + 94) % 94) + 33;
            return String.fromCharCode(newCode);
        }
        return c;
    }).join('');
    if (result2.includes("http") || / [a-z]{4,}/i.test(result2)) {
        console.log(`Shift by -${shift}:`, result2.substring(0, 60));
    }
}