export function getDayPeriod(): string[] {
    let result:string[] = []
    for (let index = 0; index < 24; index++) {
        const n1 = index + ":00";
        const n2 = n1.length === 5 ? n1 : '0' + n1 
        result.push(n2);
    }
    return result
}