declare global {
    interface Number {
        toFixedNumber(digits: number): number;
    }

    interface String {
        toPascalCase(): string;
    }
}

Number.prototype.toFixedNumber = function (this: number, digits: number): number {
    return parseFloat(this.toFixed(digits));
};

String.prototype.toPascalCase = function (this: string): string {
    return this.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}