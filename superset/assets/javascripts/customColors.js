export const customColor = (function () {
    const seen = {};
    return function (s, colors) {
        if (!s) {
            return;
        }
        let stringifyS = String(s);
        stringifyS = stringifyS.replace('---', '');
        if (seen[stringifyS] === undefined) {
            seen[stringifyS] = Object.keys(seen).length;
        }
        return colors[seen[stringifyS] % colors.length];
    };
}());

export const bnbColorsWithNames =[['#4e79a7', 'blue' ],
                                 ['#59a14f',	'green'],
                                 ['#9c755f',	'brown'],
                                 ['#f28e2b',	'orange'],
                                 ['#edc948',	'yellow'],
                                 ['#bab0ac',	'grey'],
                                 ['#e15759',	'red'],
                                 ['#b07aa1',	'purple'],
                                 ['#76b7b2',	'sky-blue'],
                                 ['#ff9da7',	'magenta']];