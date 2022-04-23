const validator = require('validator');

const validateDayInWeek = day => day <= 6 && day >= 0

const validateDayInMonth = day => day >= 1 && day <= 31

const validateMonth = month => month >= 1 && month <= 12

const validateYear = year => year >= 2000 && year <= 3000

const validateTime = (hour, minute) => validateHour(hour) && validateMinute(minute)

const validateHour = hour => hour >= 0 && hour <= 23

const validateMinute = minute => minute >= 0 && minute <= 59

const validateDate = date => date instanceof Date

const isCleanDate = date => date.getMilliseconds() + date.getSeconds() + date.getHours() + date.getMinutes() === 0

const validateDateOnly = date => validateDate(date) && isCleanDate(date)

const validatePassword = password => /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/.test(password)

const validateUsername = username => /^(?=.*[a-zA-Z]{1,})(?=.*[\d]{0,})[a-zA-Z0-9]{1,15}$/.test(username)

const validateName = name => /^([A-Z][A-Za-z ,.'`-]{3,30})$/.test(name)

const validateEmail = email => validator.isEmail(email)

const validateStringDate = date => validator.isDate(date)

const validateAttendanceStatus = status => ['pending', 'attended', 'missed'].includes(status)

module.exports = {
    validateUsername,
    validatePassword,
    validateDate,
    validateName,
    validateEmail,
    validateDayInWeek,
    validateHour,
    validateMinute,
    validateTime,
    validateDateOnly,
    validateStringDate,
    validateDayInMonth,
    validateMonth,
    validateYear,
    validateAttendanceStatus
}