import Time from "time-diff"

export class StatsCounter {
  errorCount: number
  skipCount: number
  successCount: number
  time: Time

  constructor() {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.time = new Time()
    this.time.start("formatter")
  }

  duration() {
    return this.time.end("formatter")
  }

  error() {
    this.errorCount += 1
  }

  errors(): number {
    return this.errorCount
  }

  skip() {
    this.skipCount += 1
  }

  skips(): number {
    return this.skipCount
  }

  success() {
    this.successCount += 1
  }

  successes(): number {
    return this.successCount
  }
}
