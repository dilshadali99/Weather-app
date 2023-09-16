console.log('Hello');

// let API_KEY = '771be563bee4366a56d593c2bdf37b28';

// async function showWeather(){
//     // let latitude = 15.3333;
//     // let longitude = 74.0833;
//     try{
//         let city = "patna";

//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
//         const data = await response.json();
    
//         console.log("Weather data: ",data);
//     }

//     catch(err){


//     }


//     // let newPara = document.createElement('p');
//     // let newPara2 = document.createElement('p');

//     // newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//     // newPara2.textContent = `${data?.main?.pressure.toFixed(1)} p`;

//     // document.body.appendChild(newPara2);

//     // document.body.appendChild(newPara);
// }

const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector('.weather-container');
const grantAccessContainer = document.querySelector('.grant-location-container');
const searchForm = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');

let currentTab = userTab;
const API_KEY = '771be563bee4366a56d593c2bdf37b28';
currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
   if(clickedTab!=currentTab){
       currentTab.classList.remove("current-tab");
       currentTab = clickedTab;
       currentTab.classList.add("current-tab");

       if(!searchForm.classList.contains("active")){
          userInfoContainer.classList.remove("active");
          grantAccessContainer.classList.remove("active");
          searchForm.classList.add("active");
       }
       else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.add("active");
        getfromSessionStorage();
       }
   }

}


userTab.addEventListener('click', ()=>{
    // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    switchTab(searchTab);
})

// Check if coordinates are already present in session storage
function getfromSessionStorage(){
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates){
    grantAccessContainer.classList.add("active");

  }
  else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    // make grant location invisible
     grantAccessContainer.classList.remove("active");
    //  make loader visible 
    loadingScreen.classList.add("active");

    // API CALL
    try{
      const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

      const data = await response.json();
      loadingScreen.classList.remove("active");
      userContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
      console.log("Error failed ", err);
    }
}

function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the element

    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temperature = document.querySelector('[data-temp]');
    const windSpeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-humidity]');
    const cloudiness = document.querySelector('[data-cloud]');
    console.log(weatherInfo?.sys)
    cityName.innerText = weatherInfo?.name;
    countryIcon.src =  `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp}°C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%` ;

}

// 1 hour 25 min
const grantAccessBtn = document.querySelector('[data-grantAccess]');

function getlocation(){
  if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    //  show alert;
  }
}

function showPosition(position){
   const userCoordinates = {
    lat : position.coords.latitude,
    lon : position.coords.longitude,
   }
   sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates))
   fetchUserWeatherInfo(userCoordinates);
}

grantAccessBtn.addEventListener('click', getlocation);

let searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  let cityName = searchInput.value;
  if(cityName=="") return;

  fetchSearchWeatherInfo(cityName);
});

 async function fetchSearchWeatherInfo(city){
     loadingScreen.classList.add("active");
     userInfoContainer.classList.remove("active");
     
     grantAccessContainer.classList.remove("active");

     try{
       const response =await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
       const data = await response.json();
       
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       console.log("hi");

       renderWeatherInfo(data);
     }
     catch(e){
      console.log("error while feathinch "+e)
     }
}