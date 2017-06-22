var publicFun = {
  speedJudgeFun: function(speedJudge) { //根据风速判断，描述风的内容
    var value;
    if (speedJudge >= 32.7) value = 'Hurricane force ';
    if (speedJudge >= 28.5) value = 'Violent storm ';
    if (speedJudge >= 24.5) value = 'Storm ';
    if (speedJudge >= 20.8) value = 'severe gale ';
    if (speedJudge >= 17.2) value = 'moderate gale ';
    if (speedJudge >= 10.8) value = 'Strong breeze ';
    if (speedJudge >= 8) value = 'Fresh breeze ';
    if (speedJudge >= 5.5) value = 'Moderate breeze ';
    if (speedJudge >= 3.4) value = 'Gentle breeze ';
    if (speedJudge >= 1.6) value = 'Light breeze';
    if (speedJudge >= 0.3) {
      value = 'Light air ';
    } else {
      value = 'Calm ';
    }
    return value;
  },
  toTextualDescription: function toTextualDescription(degree) {
    var value;
    if (degree > 337.5) value = '北风 ';
    if (degree > 292.5) value = '西北风 ';
    if (degree > 247.5) value = '西风 ';
    if (degree > 202.5) value = '西南风 ';
    if (degree > 157.5) value = '南风 ';
    if (degree > 122.5) value = '东南风 ';
    if (degree > 67.5) value = '东风 ';
    if (degree > 22.5) {
      value = '东南风 ';
    } else {
      value = '北风 ';
    }
    return value;
  },
  initializeData: function(that, response) { //初始化函数

    that.mainInformation.place = response.data.name;
    that.mainInformation.country = response.data.sys.country;
    that.mainInformation.temperature = response.data.main.temp;
    that.mainInformation.icon = response.data.weather[0].icon;
    that.appWeatherItemWind.speed = response.data.wind.speed;
    that.appWeatherItemWind.angle = response.data.wind.deg;
    that.appWeatherItemWind.direction = publicFun.toTextualDescription(response.data.wind.deg);
    that.appWeatherItemClouds.situation = response.data.weather[0].description;
    that.appWeatherItemPressure.situation = response.data.main.pressure + ' hpa';
    that.appWeatherItemHumidity.situation = response.data.main.humidity + ' %';
    that.appWeatherItemLocation.lat = response.data.coord.lat;
    that.appWeatherItemLocation.lon = response.data.coord.lon;

    publicFun.getSpecificTime(that);

    let speedJudge = response.data.wind.speed;
    that.appWeatherItemWind.weatherStutate = publicFun.speedJudgeFun(speedJudge);

    let sunrise = response.data.sys.sunrise;
    time = publicFun.transformTime(sunrise);
    that.appWeatherItemSunrise.situationH = time.hours;
    that.appWeatherItemSunrise.situationM = time.minutes;

    let sunset = response.data.sys.sunset;
    time = publicFun.transformTime(sunset);
    that.appWeatherItemSunset.situationH = time.hours;
    that.appWeatherItemSunset.situationM = time.minutes;

  },
  getSpecificTime: function(that) {
    let nowDate = (+new Date()) / 1000;
    let time = publicFun.transformTime(nowDate);
    that.mainInformation.time.year = time.year;
    that.mainInformation.time.month = time.month;
    that.mainInformation.time.date = time.date;
    that.mainInformation.time.minutes = time.minutes;
    that.mainInformation.time.hours = time.hours;
    that.mainInformation.time.dercTime = time.dercTime;
  },
  transformTime: function(sun) { //转化时间
    let time = {};

    let newDateNums = new Date(sun * 1000);

    let newDateTestH = newDateNums.getHours(); //获取小时
    time.hours = publicFun.timeFun(newDateTestH);

    time.dercTime = newDateTestH >= 12 ? 'PM' : 'AM';

    let newDateTestM = newDateNums.getMinutes(); //转化分钟
    time.minutes = publicFun.timeFun(newDateTestM);

    let newDateTestD = newDateNums.getDate(); //转化分钟
    time.date = publicFun.timeFun(newDateTestD);

    let newDateTestMo = newDateNums.getMonth() + 1; //转化月份
    time.month = publicFun.timeFun(newDateTestMo);

    let newDateTestY = newDateNums.getFullYear(); //转化年
    time.year = publicFun.timeFun(newDateTestY);

    return time;
  },
  timeFun: function(timeNum) { //时间转化函数
    let time;
    if (timeNum.toString().length <= 1) {
      time = '0' + timeNum;
    } else {
      time = timeNum;
    }
    return time;
  }
}
var appHandleDataFun = {
  initializeForecastData: function(that, response) {
    console.log(response);
    var dataLen = response.data.list.length;
    var resData = response.data;
    for (let i = 0; i < dataLen; i++) {
      that.forecastList[i].maxTem = resData.list[i].temp.max;
      that.forecastList[i].minTem = resData.list[i].temp.min;
      that.forecastList[i].weatherStatus = resData.list[i].weather[0].description;
      that.forecastList[i].speed = resData.list[i].speed;
      that.forecastList[i].clouds = resData.list[i].clouds;
      that.forecastList[i].pressure = resData.list[i].pressure;
      that.forecastList[i].icon = resData.list[i].weather[0].icon;
    }
  },
}
var appMainData = new Vue({
  el: '#appWeather',
  data: {
    message: '',

    mainInformation: {
      place: '',
      country: '',
      temperature: '',
      time: {
        year: '',
        month: '',
        date: '',
        minutes: '',
        hours: '',
        dercTime: ''
      },
      icon: ''
    },
    appWeatherItemWind: {
      itemTitle: '风',
      speed: '',
      direction: 'East ',
      angle: '',
      weatherStutate: ''
    },
    appWeatherItemClouds: {
      itemTitle: '多云',
      situation: ''
    },
    appWeatherItemPressure: {
      itemTitle: '压力',
      situation: ''
    },
    appWeatherItemHumidity: {
      itemTitle: '湿度',
      situation: ''
    },
    appWeatherItemSunrise: {
      itemTitle: '日出',
      situationH: '',
      situationM: ''
    },
    appWeatherItemSunset: {
      itemTitle: '日落',
      situationH: '',
      situationM: ''
    },
    appWeatherItemLocation: {
      itemTitle: '地理位置',
      lat: '',
      lon: ''
    },
    navList: [{
        navContent: '16天预报',
        desc: 'manyDays',
        complate: ''
      },
      {
        navContent: '每小时预报',
        desc: 'eachHour',
        complate: ''
      },
      {
        navContent: '其他的内容',
        desc: 'otherContent',
        complate: ''
      }
    ],
    condition: '', //tab中的判断变量
    forecastList: [{
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      },
      {
        dayTime: '',
        maxTem: '',
        minTem: '',
        weatherStatus: '',
        speed: '',
        clouds: '',
        pressure: '',
        icon: ''
      }
    ]
  },

  mounted: function() {
    this.condition = this.navList[0].desc;
    this.navList[0].complate = 'active'
    this.ajaxTest(this, {});
    this.ajaxTest(this, {
      dayNums: 16,
      weatherOrForecast: 'forecast/daily'
    })
  },
  methods: {
    addCityName: function() {
      this.combineObj();
    },
    onEnter: function() {
      this.combineObj();
    },
    combineObj: function() { //把字符串赋给对象
      var apiArguments = {};
      apiArguments.name = this.message;
      this.ajaxTest(this, apiArguments);
    },

    ajaxTest: function(obj, apiArguments) {

      var that = obj.$data;
      let id = apiArguments.id || 'dd561652b90af3a2408ea80b668650d7';
      let cityName = apiArguments.name || 'beijing';
      let weatherOrForecast = apiArguments.weatherOrForecast || 'weather';
      let dayNums = apiArguments.dayNums || '';

      axios.get(`http://api.openweathermap.org/data/2.5/${weatherOrForecast}?q=${cityName}&appid=${id}&units=metric&mode=json&cnt=${dayNums}`)
        .then(function(response) { //成功获取到数据
          if (!(apiArguments.dayNums)) {
            publicFun.initializeData(that, response);
          } else {
            appHandleDataFun.initializeForecastData(that, response);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    judgeShowContent: function(event) { //tab切换
      var ele = event.target;
      var eleId = ele.dataset.title;
      if (eleId === this.navList[0].desc) {
        this.condition = eleId;
        this.changeCss(eleId);
      } else if (eleId === this.navList[1].desc) {
        this.condition = eleId;
        this.changeCss(eleId);
      } else {
        this.condition = eleId;
        this.changeCss(eleId);
      }
    },
    changeCss: function(id) { //改变当前导航的样式
      var index = 0;
      for (let i = 0; i < this.navList.length; i++) {
        if (id === this.navList[i].desc) index = i;
        this.navList[i].complate = '';
      }
      this.navList[index].complate = 'active'
    }
  }
})
