import config from '../config'
import {
  compare,
  CompareResult,
  getWeekdays,
  getPreviousMonth,
  getNextMonth,
  getMonthDayCount
} from '../common/utils'

import { Locale, parseLocale } from './locale'
import { CalendarContext } from '@fullcalendar/core/internal.js'

export interface DateObj {
  year: number
  month: number
  date: number
}

export interface Cell extends DateObj, CompareResult {
  isToday: boolean
}

// 继承了 DateObj 接口的所有属性，但排除了 date 属性。
export interface IterateeContext extends Omit<DateObj, 'date'> {
  cell: () => Cell
}

export interface ReturnObj<T>  extends Cell {
    weekNum: number  // 一年中的第几周
    weekInMonth: number // 一个月中的第几周
    weekIndex: number 
}

export interface WeekObj<T> {
    weekNum: number
    days: ReturnObj<T>[]
}

export interface MonthObj<T> {
    yearNum: number
    monthNum: number
    weeks: WeekObj<T>[]
}

/**
 * 用于生成最终数据结构的迭代器
 * Iteratee<T> 表示一个接受 Date 类型和 IterateeContext 类型参数的函数，它返回一个类型为 T 的值。
 */
export type Iteratee<T> = (date: Date, ctx: IterateeContext) => ReturnObj<T>

export interface CalendarOptions<T=Date> {
  viewType?:ViewEnum
  firstWeekDay?: number
  visibleWeeksCount?: number
  locale?: string | Locale
  iteratee?: Iteratee<T>
}

export interface WeekHead {
  day: number
  name: string
  short: string
  abbr: string
}


// 视图类型
export enum ViewEnum {
    UNKNOWN = 0,
    MONTHLY = 1,
    WEEKLY = 2,
    DAILY = 3,
    YEARLY = 4,
}

enum WeekEnum {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
}


export class Calendar<T> {
  /**
   * 自定义迭代函数
   */
  iteratee: Iteratee<T>

  /**
   * 一星期的数字
   * 可以根据该字段,判断本月前面还有几天
   *    cursor.setDate(cursor.getDate() - weekdays.indexOf(cursor.getDay()))
   */
  weekdays: number[]

  /**
   * 一周开始的时间
   */
  firstWeekDay: number

  /**
   * 日历可见的周数量
   */
  visibleWeeksCount: number = 5

  /**
   * 本地化配置
   */
  private _locale!: Locale

  // 视图设置
  viewType: ViewEnum

  constructor(options?: CalendarOptions<T>) {
    options = options || {}

    this.firstWeekDay = options.firstWeekDay || config.firstWeekDay
    this.visibleWeeksCount = options.visibleWeeksCount || config.visibleWeeksCount
    this.weekdays = getWeekdays(this.firstWeekDay)
    // 如果 options 不存在或者没有 iteratee 属性. 则使用后面的箭头函数
    // 箭头函数，它接受一个参数 x，将其强制类型转换为 unknown 类型，然后再将其强制类型转换为泛型类型 T。最终的结果就是将 x 作为 T 类型返回。
    this.iteratee = options?.iteratee || ((t,y):ReturnObj<T> => {
        // console.log(y.cell()); 
        return {t,...y.cell()}
    })
    this.locale(options.locale)
    this.viewType = options?.viewType || ViewEnum.MONTHLY
  }

  /**
   * 本地化语言环境设置
   *
   * @param locale
   */
  locale(name?: string | Locale, locale?: Locale): this {
    this._locale = parseLocale(name, locale)
    return this
  }

  /**
   * 获取日历头部周的名称列表
   */
  getWeekHead(): WeekHead[] {
    const { weekdays, weekdaysAbbr, weekdaysShort } = this._locale
    return this.weekdays.map((day) => ({
      day: day,
      name: weekdays[day],
      abbr: weekdaysAbbr[day],
      short: weekdaysShort[day]
    }))
  }

  /**
   * 获取某一个月日历数据
   *
   * @param year 年
   * @param month 月
   *
   * @return 二维数组结构的日期列表
   */
  getMonthCalendar(year: number, month: number): ReturnObj<T>[] {
    const calendar: ReturnObj<T>[] = []
    const count = this.visibleWeeksCount * 7

    const now = new Date()

    const nowObj = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      date: now.getDate()
    }

    let weekNum:number = 0
    let weekInMonth: number = 0
    this.unstable_iterDates(year, month, 1, count, true, (dateObj, i) => {
        // 七天一周,每七天初始化一次
        if (!(i % 7)) {
            weekNum = this.getCurrentWeekOfYear(dateObj)
            weekInMonth++
        }

        const curYear = dateObj.getFullYear()
        const curMonth = dateObj.getMonth() + 1
        const curDate = dateObj.getDate()

        // 目标月份
        const result = compare(curYear, curMonth, year, month)
        // 系统当前月份
        const { inMonth } = compare(curYear, curMonth, nowObj.year, nowObj.month)
        const item = {
            ...result,
            year: curYear,
            month: curMonth,
            date: curDate,
            isToday: inMonth && curDate === nowObj.date,
            weekNum: weekNum,
            weekInMonth: weekInMonth,
            weekIndex: dateObj.getDay(),
        }
        calendar.push(item)
    })
    return calendar
  }

  /**
   * 计算指定日期是本年度的第几周
   * @param currentDate 指定日期
   * @returns 
   */
  getCurrentWeekOfYear(currentDate: Date): number {
    const currentYear = currentDate.getFullYear();
    const firstDayOfYear = new Date(currentYear, 0, 1);
    const currentDayOfYear = Math.floor((currentDate.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;
    const currentWeekOfYear = Math.ceil(currentDayOfYear / 7);
    return currentWeekOfYear;
  }

  getPreviousMonthCalendar(year: number, month: number): ReturnObj<T>[] {
    const pre =  this.getMonthCalendar(...getPreviousMonth(year, month))
    // pre.weeks.pop()
    return pre
  }

  getPreviousMonthCalendarByDate(day: ReturnObj<T>): ReturnObj<T>[] {
    const next = this.getMonthCalendar(day.year, day.month)
    // 删除下一周重复的天数
    let point: number = 0
    for (let index = 0; index < next.length; index++) {
        const theOne = next[index]
        if (theOne.year === day.year && theOne.month === day.month && theOne.date === day.date) {
            point = index
            break
        }
    }
    const newList: ReturnObj<T>[] = next.slice(0, point)
    return newList
  }

  getNextMonthCalendar(year: number, month: number): ReturnObj<T>[] {
    const next = this.getMonthCalendar(...getNextMonth(year, month))
    // next.weeks.shift()
    return next
  }

  getNextMonthCalendarByDate(day: ReturnObj<T>): ReturnObj<T>[] {
    const next = this.getMonthCalendar(day.year, day.month)
    // 删除上一周重复的天数
    let point: number = 0
    for (let index = 0; index < next.length; index++) {
        const theOne = next[index]
        if (theOne.year === day.year && theOne.month === day.month && theOne.date === day.date) {
            point = index
            break
        }
    }
    const newList: ReturnObj<T>[] = next.slice(point+1)
    return newList
  }

  /**
   * 获取某一个月的时间列表
   *
   * @param year 年
   * @param month 月
   *
   * @return 时间列表
   */
  getMonthDates(year: number, month: number): Date[] {
    const dates: Date[] = []
    const count = getMonthDayCount(year, month)

    this.unstable_iterDates(year, month, 1, count, false, (date) => {
      dates.push(date)
    })

    return dates
  }

  /**
   * 获取某一周的时间列表
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间列表
   */
  getWeekDates(year: number, month: number, date: number): Date[] {
    const dates: Date[] = []

    this.unstable_iterDates(year, month, date, 7, true, (date) => {
      dates.push(date)
    })

    return dates
  }

  /**
   * 获取上周的时间列表
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间列表
   */
  getPreviousWeekDates(year: number, month: number, date: number): Date[] {
    const time = this.unstable_getPreviousWeekStartTime(year, month, date)
    return this.getWeekDates(time.getFullYear(), time.getMonth() + 1, time.getDate())
  }

  /**
   * 获取下周的时间列表
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间列表
   */
  getNextWeekDates(year: number, month: number, date: number): Date[] {
    const time = this.unstable_getNextWeekWeekStartTime(year, month, date)
    return this.getWeekDates(time.getFullYear(), time.getMonth() + 1, time.getDate())
  }

  /**
   * (不稳定) 获取下一周开始的时间
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间对象
   */
  unstable_getNextWeekWeekStartTime(year: number, month: number, date: number): Date {
    const time = new Date(year, month - 1, date, 0, 0, 0, 0)
    time.setDate(time.getDate() - this.weekdays.indexOf(time.getDay()) + 7)
    return time
  }

  /**
   * (不稳定) 获取上周开始的时间
   *
   * @param year 年
   * @param month 月
   * @param date 日
   *
   * @return 时间对象
   */
  unstable_getPreviousWeekStartTime(year: number, month: number, date: number): Date {
    const time = new Date(year, month - 1, date, 0, 0, 0, 0)
    time.setDate(time.getDate() - this.weekdays.indexOf(time.getDay()) - 7)
    return time
  }

  /**
   * (不稳定) 根据指定时间开始生成时间列表
   *
   * @param year 年
   * @param month 月
   * @param date  日
   * @param count 生成的时间数量
   * @param resetStartOfWeek 是否从本周开始时间循环
   * @param cb 回调函数
   *
   * @return 时间列表
   */
  unstable_iterDates(
    year: number,
    month: number,
    date: number,
    count: number,
    resetStartOfWeek: boolean,
    cb: (date: Date, i: number) => void
  ): void {
    const weekdays = this.weekdays
    const cursor = new Date(year, month - 1, date, 0, 0, 0, 0)

    if (resetStartOfWeek === true) {
      // 回到当前月第一天所在周的周一,也就补齐了日历上每月开始缺的几天
      // 末尾缺的几天因为有 count,所以自然补齐了
      cursor.setDate(cursor.getDate() - weekdays.indexOf(cursor.getDay()))
    }

    for (let i = 0; i < count; i++) {
      cb(new Date(cursor), i)
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  /**
   * 打印日历
   *
   * 仅在支持 console.table 的环境下可用
   *
   * @param calendar 日历对象
   * @param year     年
   * @param month    月
   */
  static printCalendar(
    calendar: Calendar<Date>,
    year: number,
    month: number,
    visible: boolean = false
  ): void {
    const columns = calendar.getWeekHead().map((w) => w.abbr)
    const arrays = calendar.getMonthCalendar(2020, 12)
    const rows = arrays.map((dates) => {
      const row: Record<string, number> = {}
      dates.forEach((date, index) => {
        if (visible || isCurrentMonth(date)) {
          row[columns[index]] = date.getDate()
        }
      })
      return row
    })

    function isCurrentMonth(d: Date) {
      return d.getFullYear() === year && d.getMonth() + 1 === month
    }

    console.table(rows, columns)
  }
}
