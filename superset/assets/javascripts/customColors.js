export const customColor = (function () {
    const seen = {};
    return function (s, colors) {
        if (!s) {
            return;
        }
        console.log(s);
        let stringifyS = String(s);
        stringifyS = stringifyS.replace('---', '');
        if (seen[stringifyS] === undefined) {
            seen[stringifyS] = Object.keys(seen).length;
        }
        return colors[seen[stringifyS] % colors.length];
    };
}());