export function getLeadingChar(str, pos, isFirst) {
    let loop = true;
    let i = pos;
    while (loop) {
        if (i <= 0) {
            loop = false;
        }
        if (isFirst && str[pos] === '\n') {
            loop = false;
            return 0;
        }
        else {
            i--;
            if (str[i] === '\n') {
                loop = false;
                return pos - i;
            }
        }
        if (str[i] === '\n') {
            loop = false;
            return pos - i;
        }
    }
    return 0;
}
