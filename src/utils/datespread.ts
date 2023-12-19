enum WeekEnum {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
}

enum MonthEnum {
    JAUNARY = 0,
    FEBAURAY = 1,
    MARCH = 2,
    APRIAL = 3,
    MAY = 4,
    JAUN = 5,
    JULY = 6,
    AUGUST = 7,
    SEPMTEBER = 8,
    OCTOBER = 9,
    NOVEMBER = 10,
    DECEMBER = 11,
}

// 视图类型
enum ViewEnum {
    UNKNOWN = 0,
    MONTHLY = 1,
    WEEKLY = 2,
    DAILY = 3,
    YEARLY = 4,
}



interface DayObj {
    year: number
    month: MonthEnum
    date: number
    week: WeekEnum
    isToday: boolean
}

interface CreateWindowsOptions {
    viewType: ViewEnum
    start
}


// 窗口管理
export class Windows {
    viewType: ViewEnum
    // 窗口视图块数量(多少天)
    viewDayNum: number

    constructor(options: CreateWindowsOptions) {
        this.viewType = options.viewType
    }



}


// 日期延展器
export class DateSpread {
    // 进入的位置
    entryPoint: Date
    // 往前延展的位置
    prePoint: Date
    // 往后延展的位置
    nextPoint: Date
    // 延展

    constructor(entryPoint)
    
}