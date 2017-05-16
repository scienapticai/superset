export const validateColorHexCodes = function(hexCode){
    console.log(hexCode);
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hexCode);
}
