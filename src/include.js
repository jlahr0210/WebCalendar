Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1)
  var jul = new Date(this.getFullYear(), 6, 1)
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
}
Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset()
}
Date.prototype.getMonthName = function (mode = 'long') {
  return this.toLocaleString('en-US', { month: mode })
}
Date.prototype.getFirstWeekdayOfMonth = function () {
  return new this.constructor(this.getFullYear(), this.getMonth(), 1).getDay()
}
Date.prototype.getNumberOfDaysInMonth = function () {
  return new this.constructor(
    this.getFullYear(),
    this.getMonth() + 1,
    0
  ).getDate()
}
Date.prototype.getActualDay = function () {
  return this.getDay() + 1
}
Date.prototype.getActualMonth = function () {
  return this.getMonth() + 1
}
