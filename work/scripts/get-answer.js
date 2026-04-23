const line1 = "/rRoSapsG0mYJtfMxKA3LigccFOylL+ZL7stK8x1dk+43Z2sjXhINL+q1BtWBSCQBfnAJXRwYkBNGBxZyinKV+Iz3vSpfRLa6kj=";

const rot47 = (s) => s.split('').map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(33 + ((code - 33 + 47) % 94));
    return c;
}).join('');

const answer = rot47(line1);
console.log("Answer:");
console.log(answer);