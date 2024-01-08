import { expect, test } from 'vitest'
import {CalendarWeekly,COptions,CDay } from './calendar-weekly'


test('get-point-week', ()=>{
    let calendar = new CalendarWeekly({pointDate:new Date(2024, 0, 5, 0, 0, 0, 0)})
    expect(calendar.getPointWeeks()).toEqual([
        { year: 2023, month: 11, date: 31, week: 0 },
        { year: 2024, month: 0, date: 1, week: 1 },
        { year: 2024, month: 0, date: 2, week: 2 },
        { year: 2024, month: 0, date: 3, week: 3 },
        { year: 2024, month: 0, date: 4, week: 4 },
        { year: 2024, month: 0, date: 5, week: 5 },
        { year: 2024, month: 0, date: 6, week: 6 }
    ])
    expect(calendar.bothLimits).toEqual({
        "min": {
           "date": 31,
           "month": 11,
           "week": 0,
           "year": 2023,
        },
        "max": {
            "date": 6,
            "month": 0,
            "week": 6,
            "year": 2024,
         },
    })

    let want = ()=>{
        let result: CDay[] = []
        let start: number = 7
        for (let index = 0; index < 7; index++) {
            result.push({
                year: 2024,
                month: 0,
                date: start,
                week: start -7
            })
            start++
        }
        return result
    }
    expect(calendar.yieldNextWeeks()).toEqual(want())

    expect(calendar.bothLimits).toEqual(
        {
            "min": {
               "date": 31,
               "month": 11,
               "week": 0,
               "year": 2023,
            },
            "max": {
                "date": 13,
                "month": 0,
                "week": 6,
                "year": 2024,
             },
        }
    )

    expect(calendar.yieldPreWeeks()).toEqual([
        { year: 2023, month: 11, date: 24, week: 0 },
        { year: 2023, month: 11, date: 25, week: 1 },
        { year: 2023, month: 11, date: 26, week: 2 },
        { year: 2023, month: 11, date: 27, week: 3 },
        { year: 2023, month: 11, date: 28, week: 4 },
        { year: 2023, month: 11, date: 29, week: 5 },
        { year: 2023, month: 11, date: 30, week: 6 }
    ])

    expect(calendar.bothLimits).toEqual({
        "min": {
            "date": 24,
            "month": 11,
            "week": 0,
            "year": 2023,
         },
         "max": {
             "date": 13,
             "month": 0,
             "week": 6,
             "year": 2024,
          },
    })
})
