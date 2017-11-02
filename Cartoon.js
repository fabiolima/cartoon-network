class Cartoon {
  constructor(params) {
    this.title         = params.title         || "";
    this.originalTitle = params.originalTitle || "";
    this.thumbnail     = params.thumbnail     || "";
    this.schedule      = params.schedule      || {};
  }

  isScheduled(dayOfWeek, hour) {
    moment.locale('en');

    return this.schedule[dayOfWeek].some(time => {
      return time.hour() === parseInt(hour);
    })
  }
}
