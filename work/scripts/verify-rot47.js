const line2 = "(96C6 :E 2== 3682}0_>AIqd:'";

const rot47 = (s) => s.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(33 + ((code - 33 + 47) % 94));
    return c;
}).join('');

const result = rot47(line2);
console.log("Result:", result);
console.log("Expected:", "Where it all begaN_0mpxB5iVQ");
console.log("Match:", result === "Where it all begaN_0mpxB5iVQ");