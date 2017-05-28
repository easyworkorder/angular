export { }

declare global {
    // interface StringConstructor {
    interface String {
        toNormalText (): string;
        isNullOrEmpty (): any;
        trim (): string;
        upper (): string;
        convertToISOString (): string;
        toDate (): Date;
        extractIdFromURL (): string;
    }

    interface Date {
        toDate (): Date;
    }
}