enum WindowsMod {
    UNKNOWN,
    YEARLY,
    MONTHLY,
    WEEKLY,
    DAILY,
}

export function GetWindowsModDateLength(mod: WindowsMod): number {
    length = 1
    switch (mod){
        case WindowsMod.YEARLY:
            length = 360
        case WindowsMod.MONTHLY:
            length = 42
        case WindowsMod.WEEKLY:
            length = 7
        case WindowsMod.DAILY:
            length = 1;
    }
    return length
}

export {
    WindowsMod
}