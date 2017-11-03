moment.locale('pt-br');

Vue.component('cartoon-episode-modal', {
  template: '#cartoon-episode-modal',
  props: ['cartoon']
});

Vue.component('cartoon-schedule-modal', {
  template: '#cartoon-schedule-modal',
  props: ['cartoon'],
  methods: {
    getTime(moment) {
      return moment.format("HH:mm");
    },

    getDayOfWeek(number) {
      return moment().day(number).format("DD");
    }
  }  
});

var app = new Vue({
  el: '#app',

  mounted: function() {
    CARTOON_SEEDS.forEach(cartoon => {
      this.cartoons.push(new Cartoon(cartoon));
    });

    this.currentDay        = moment().format('DD');
    this.currentColor      = this.getCurrentColor(this.getCurrentHour());
    this.scheduleHours     = SCHEDULE_HOURS;
    this.scheduledCartoons = this.getSchedule(this.getDayOfWeek(), this.getCurrentHour());
  },

  data: {
    cartoons: [],
    selectedCartoon: {},
    scheduledCartoons: [],
    scheduleHours: [],
    currentDay: '',
    currentHour: function() { return this.getCurrentHour(); },
    selectedHour: {},
    currentColor: '',
    showModal: false,
    galleryStart: 0,
    galleryEnd: 5
  },

  watch: {
    selectedHour: function(selectedHour) {
      let hour = selectedHour.moment.hour();

      this.scheduledCartoons = this.getSchedule(this.getDayOfWeek(), hour);
      this.currentColor      = this.getCurrentColor(hour);
    }
  },

  methods: {
    getCurrentColor(hour) {
      return hour === this.getCurrentHour() ? 'black' : ['blue', 'pink', 'yellow'][hour % 3];
    },

  	setSelected(hour) {
      this.selectedHour = hour;
    },

    getSelectedHour() {
      return this.selectedHour.moment ?
      this.selectedHour.moment.hour() : this.getCurrentHour();
    },

    getCurrentHour() {
      return parseInt(moment().format('H'));
    },

    getDayOfWeek(locale = 'en') {
      moment.locale(locale);
      return moment(this.currentDay, 'DD').format('dddd').toLowerCase();
    },

    nextDay() {
      this.currentDay = moment(this.currentDay, 'DD').add(1, 'days').format('DD');
    },

    getSchedule: function(dayOfWeek, hour) {
      let scheduledCartoons = this.cartoons.filter((cartoon) => {
        return cartoon.isScheduled(dayOfWeek, hour);
      });

      return this.sortScheduledCartoons(scheduledCartoons, dayOfWeek, hour);
    },

    nextCartoon: function() {
      if (this.galleryEnd < this.cartoons.length) {
        this.galleryStart ++;
        this.galleryEnd ++;
      }
    },

    previousCartoon: function() {
      if (this.galleryStart > 0) {
        this.galleryStart --;
        this.galleryEnd --;
      }
    },

    sortScheduledCartoons: function(cartoons, dayOfWeek, hour) {
      moment.locale('en');

      let sorted = [];

      cartoons.forEach(cartoon => {
        cartoon.schedule[dayOfWeek].forEach(time => {
          if (time.hour() != hour) return;

          sorted.push({
            cartoon: cartoon,
            time: {
              hour: time.format("HH"),
              minutes: time.format("mm")
            }
          })
        })
      })

    	return _.orderBy(sorted, 'time.minutes');
    },

    onCartoonHover: function(element) {
      // Will set an class like 'black-rgba', .. , 'pink-rgba'
      element.target.classList.toggle(
        this.getCurrentColor(this.getSelectedHour()) + '-rgba'
      );
    }
  }
});
