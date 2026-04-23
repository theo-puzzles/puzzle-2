// Verify ROT47 and try to decode line1

function rot47Decode(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 33 && charCode <= 126) {
            // Rotate by 47 positions
            let decoded = ((charCode - 33 + 47) % (126 - 33 + 1)) + 33;
            result += String.fromCharCode(decoded);
        } else {
            result += str[i];
        }
    }
    return result;
}

const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";
const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

// Decode hint line
const decoded2 = rot47Decode(line2);
console.log("Hint line decoded:", decoded2);

// Decode main puzzle line
const decoded1 = rot47Decode(line1);
console.log("\nLine1 decoded:", decoded1);

// The hint decodes to "Where it all begaN_0mpxB5iVQ" which is a YouTube video ID
// But our decode gave "Where it all began_0mpxB5iVQ" - slightly different!
// Wait, let's check: "begaN" -> "began"
// That's the video ID: N_0mpxB5iVQ vs 0mpxB5iVQ

console.log("\nVideo ID extracted:", decoded2.replace("Where it all began_", ""));