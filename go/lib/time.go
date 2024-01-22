package lib

import (
	"time"
)

func TimeUntilNextMinute() time.Duration {
	now := time.Now()
	next := now.Truncate(time.Minute).Add(time.Minute)
	return next.Sub(now)
}

func CompareTime(time1 time.Time, time2 time.Time) int {
	hour1, minute1 := time1.Hour(), time1.Minute()
	hour2, minute2 := time2.Hour(), time2.Minute()

	if hour1 < hour2 {
		return -1
	} else if hour1 > hour2 {
		return 1
	}

	if minute1 < minute2 {
		return -1
	} else if minute1 > minute2 {
		return 1
	}

	return 0
}

func IsDateSelected(date time.Time, dates []time.Time) bool {
	for _, item := range dates {
		if item.Year() == date.Year() && item.Month() == date.Month() && item.Day() == date.Day() {
			return true
		}
	}
	return false
}

func IsWeekdaySelected(day int, selectedDays int) bool {
	if day < 0 || day > 6 {
		return false
	}

	return (selectedDays & (1 << day)) != 0
}

func IsMonthDaySelected(day int, selectedDays int) bool {
	if day < 1 || day > 31 {
		return false
	}

	return (selectedDays & (1 << (day - 1))) != 0
}

func GetLastDayOfMonth(date time.Time) int {
	firstOfNextMonth := time.Date(date.Year(), date.Month() + 1, 1, 0, 0, 0, 0, date.Location())

	lastDay := firstOfNextMonth.AddDate(0, 0, -1)

	return lastDay.Day()
}