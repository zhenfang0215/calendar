import {
    getWeekdays,
  } from '../common/utils'


export interface CDay {
    year: number   // ~
    month: number  // 0-11
    date: number   // 1-31
    week: number   // 0-6, 0 is Sunday
}


export interface COptions {
    pointDate?: Date
    firstWeekDay?: number
}


export class CalendarWeekly {
    point: CDay
    firstWeekDay: number
    weekdays: number[]

    bothLimits: {
        min: CDay
        max: CDay
    }

    constructor(options: COptions) {
        let pointData =  options.pointDate || new Date()
        console.log(pointData)
        this.point = this.getCDayFromDate(pointData)
        this.firstWeekDay = options.firstWeekDay || 0
        this.weekdays = getWeekdays(this.firstWeekDay)
        // console.log(this.point, this.firstWeekDay, this.weekdays)
        this.bothLimits = {min:this.point, max:this.point}
    }


    setPoint(day: CDay) {
        this.point = day
    }

    getWeeksByDate(day: CDay):CDay[]  {
        const cursor = new Date(day.year, day.month, day.date, 0, 0, 0, 0)
        // 回到周一
        cursor.setDate(cursor.getDate() - this.weekdays.indexOf(cursor.getDay()))

        const result: CDay[] = []
        for (let index = 0; index < 7; index++) {
            result.push(this.getCDayFromDate(cursor))
            cursor.setDate(cursor.getDate() + 1)
        }
        return result
    }


    getPointWeeks(): CDay[] {
        let result = this.getWeeksByDate(this.point)
        this.setBothSideLimit(result, "all")
        return result
    }


    yieldNextWeeks(): CDay[] {
        let point = this.bothLimits ? this.bothLimits.max : this.point
        const cursor = new Date(point.year, point.month, point.date, 0, 0, 0, 0)
        cursor.setDate(cursor.getDate() + 1)
        let result = this.getWeeksByDate(this.getCDayFromDate(cursor))
        this.setBothSideLimit(result, "right")
        return result
    }

    yieldPreWeeks(): CDay[] {
        let point = this.bothLimits ? this.bothLimits.min : this.point
        const cursor = new Date(point.year, point.month, point.date, 0, 0, 0, 0)
        cursor.setDate(cursor.getDate() - 1)
        let result = this.getWeeksByDate(this.getCDayFromDate(cursor))
        this.setBothSideLimit(result, "left")
        return result
    }


    setBothSideLimit(days: CDay[], dir: string) {
        if (dir === "left") {
            this.bothLimits.min = days[0]
        }else if (dir === "right") {
            this.bothLimits.max = days[days.length-1]
        }else if (dir === "all") {
            this.bothLimits.min = days[0]
            this.bothLimits.max = days[days.length-1]
        }
    }


    getCDayFromDate(date: Date): CDay {
        return {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
            week: date.getDay(),
        }
    }
}

