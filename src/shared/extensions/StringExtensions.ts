declare global {
    interface Number {
        toFixedNumber(digits: number): number;
    }
}

Number.prototype.toFixedNumber = function (this: number, digits: number): number {
    return parseFloat(this.toFixed(digits));
};