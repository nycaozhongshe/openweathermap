var wrap = new Vue({
	el: '#wrap',
	//	template:'<city noc = ""> </city>',
	data: {
		name: '',
		country: '',
		weather: '',
		icon: '',
		temp: '',
		description: '',
		pressure: "",
		humidity: '',
		sunrise: '',
		sunset: '',
		lon: '',
		lat: '',
		time: "",
		city: 'beijing',
		speed: '',
		deg: '',
		lists: [{
			day: '',
			min: '',
			pressure: '',
			description: '',
			clouds: '',
			icon: '',
			speed: '',
			nowweek: '',
			nowday: '',
			nowmonth: ''
		}],
		listHour: [{
			date: '',
			istoday: false,
			tempweather: [{
				max: '',
				min: '',
				temp: '',
				icon: '',
				temp: '',
				time: '',
				speed: '',
				description: ''
			}]
		}]
	},
	mounted: function() {
		this.getData()
		this.getfifteenData()
		this.gethourData()
	},
	methods: {
		getData: function() {
			var that = this
			let intn = 'http://api.openweathermap.org/data/2.5/weather?q='
			let ha = '&lang=zh-cn&appid=c8bb4ad6371318a331ab6a20bdfd1b31&units=metric'
			axios.get(intn + that.city + ha).then(function(response) {
					let speed = response.data.wind.speed
					let deg = response.data.wind.deg
					that.speed = that.speedTxt(speed) + speed + ''
					that.deg = that.toTextualDescription(deg) + '(' + deg + ')'
					console.log(that.deg)
					that.name = response.data.name
					that.country = response.data.sys.country
					that.weather = response.data.weather[0].main
					that.temp = response.data.main.temp + '°C'
					that.description = response.data.weather[0].description
					that.pressure = response.data.main.pressure + 'hpa'
					that.humidity = response.data.main.humidity + '%'
					let sunriseDate = new Date(response.data.sys.sunrise * 1000)
					that.sunrise = that.sun(sunriseDate)
					let sunsetDate = new Date(response.data.sys.sunset * 1000)
					that.sunset = that.sun(sunsetDate)
					that.lon = response.data.coord.lon
					that.lat = response.data.coord.lat
					var newtime = new Date()
					that.time = that.nowTime(newtime)
					that.icon = "http://openweathermap.org/img/w/" + response.data.weather[0].icon + ".png"
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		getfifteenData: function() {
			that = this
			let damainName = 'http://api.openweathermap.org/data/2.5/forecast/daily?q='
			let apiId = '&appid=c8bb4ad6371318a331ab6a20bdfd1b31&units=metric&cnt=13'
			axios.get(damainName + that.city + apiId).then(function(response) {
				var nowTime = new Date().toDateString()
				that.lists = []
				for(var i = 0; i < response.data.list.length; i++) {
					var dt = new Date(response.data.list[i].dt * 1000)
					var iDate = new Date(response.data.list[i].dt * 1000).toDateString()
					var a = iDate.split(' ')

					a.pop()
					var obj = {
						'day': response.data.list[i].temp.day + '°C',
						'min': response.data.list[i].temp.min + '°C',
						'pressure': response.data.list[i].pressure + 'hpa',
						'description': response.data.list[i].weather[0].description,
						'clouds': response.data.list[i].clouds + '%',
						'icon': "http://openweathermap.org/img/w/" + response.data.list[i].weather[0].icon + ".png",
						'speed': response.data.list[i].speed + ' m/s ',
						'time': a.join(' ')
					}
					if(iDate == nowTime) {
						obj.today = 'today';
					}
					that.lists.push(obj)
				}
			}).catch(function(error) {
				console.log(error);
			})
		},
		gethourData: function() {
			that = this
			let damainName = 'http://api.openweathermap.org/data/2.5/forecast?q='
			let apiId = '&appid=c8bb4ad6371318a331ab6a20bdfd1b31&units=metric'
			axios.get(damainName + 'this.city' + apiId).then(function(response) {
				that.listHour = []
				for(var i = 0; i < response.data.list.length; i++) {
					var dt = new Date(response.data.list[i].dt * 1000).toLocaleTimeString()
					var obja = {
						'time': dt,
						'min': response.data.list[i].main.temp_min,
						'max': response.data.list[i].main.temp_max,
						'temp': response.data.list[i].main.temp,
						'pressure': response.data.list[i].main.pressure,
						'description': response.data.list[i].weather[0].description,
						'clouds': response.data.list[i].clouds.all + '%',
						'speed': response.data.list[i].wind.speed + ' m/s ',
						'temp': response.data.list[i].main.temp + '°C',
						'icon': "http://openweathermap.org/img/w/" + response.data.list[i].weather[0].icon + ".png"
					}
					var obj = {
						'date': '',
						'tempweather': []
					}
					obj.tempweather.push(obja)
					if(i === 0 || new Date(response.data.list[i].dt * 1000).toDateString() !== new Date(response.data.list[i - 1].dt * 1000).toDateString()) {
						obj.date = new Date(response.data.list[i].dt * 1000).toDateString()
						var myDate = new Date().toDateString();
						var iDate = new Date(response.data.list[i].dt * 1000).toDateString()
						if(myDate == iDate) {
							obj.isToday = true
						} else {
							obj.isToday = false
						}
					}
					that.listHour.push(obj)
				}
			}).catch(function(error) {
				console.log(error);
			})
		},
		submit: function() {
			var search = document.querySelector('.search')
			this.city = search.value
			this.getData()
			this.getfifteenData()
			this.gethourData()
		},
		getDay: function(nowTime) {

			let day = nowTime.getDate()
			return(day)
		},
		getMonth: function(nowTime) {
			let month = nowTime.getMonth()
			return month + 1
		},
		getWeek: function(nowTime) {
			let week = nowTime.getDay()
			let arr = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']
			return(arr[week])
		},
		speedTxt: function(speed) { //根据风速判断，描述风的内容
			if(speed >= 32.7) return 'Hurricane force ';
			if(speed >= 28.5) return 'Violent storm ';
			if(speed >= 24.5) return 'Storm ';
			if(speed >= 20.8) return 'severe gale ';
			if(speed >= 17.2) return 'moderate gale ';
			if(speed >= 10.8) return 'Strong breeze ';
			if(speed >= 8) return 'Fresh breeze ';
			if(speed >= 5.5) return 'Moderate breeze ';
			if(speed >= 3.4) return 'Gentle breeze ';
			if(speed >= 1.6) return 'Light breeze';
			if(speed >= 0.3) {
				return 'Light air ';
			} else {
				return 'Calm ';
			}
		},
		toTextualDescription: function(degree) {
			if(degree > 337.5) return '北风 ';
			if(degree > 292.5) return '西北风 ';
			if(degree > 247.5) return '西风 ';
			if(degree > 202.5) return '西南风 ';
			if(degree > 157.5) return '南风 ';
			if(degree > 122.5) return '东南风 ';
			if(degree > 67.5) return '东风 ';
			if(degree > 22.5) {
				return '东南风 ';
			} else {
				return '北风 ';
			}
		},
		sun: function(sunriseDate) {
			let riseHour = this.zero(sunriseDate.getHours())
			let riseMinmutes = this.zero(sunriseDate.getMinutes())
			return riseHour + ':' + riseMinmutes
		},
		nowTime: function(newtime) {
			let year = newtime.getFullYear()
			let month = newtime.getMonth()
			let day = newtime.getDay()
			let hour = this.zero(newtime.getHours())
			let min = this.zero(newtime.getMinutes())
			return year + '-' + (month + 1) + '-' + day + " " + hour + ':' + min
		},
		zero: function(year) {

			if(year >= 0 && year <= 9) {
				year = "0" + year;
			}
			return year
		}
	},
	components: {
		'nyto': {
			template: '<span><br/><img :src="icon"/> {{temp}} </span>',
			props: ['icon', 'temp']
		},
		'tow': {
			template: '<span>{{noc}},{{country}}</span> ',
			props: ['noc', 'country']
		},
		'wind': {
			template: '<tr><th >Wind</th><th >{{speed}}<br/>{{deg}}</th></tr>',
			props:['speed', 'deg']
			}
		}
})

$('.list li').on('click', function() {
	var day = $('.fiveday>li')
	$('.list>li').css({
		borderBottom: '1px solid #eee'
	})
	day.css({
		display: 'none'
	})
	$(this).css({
		borderBottom: '1px solid red'
	})
	day.eq($(this).index()).css({
		display: 'block'
	})
})