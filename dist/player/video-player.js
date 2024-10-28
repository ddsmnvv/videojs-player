let seasons = [
  {
    seasonNumber: 1,
    title: "Название первого сезона",
    description: "Первый сезон, в котором начинается история.",
    episodes: [
      {
        episodeNumber: 1,
        title: "Эпизод 1: Название эпизода 1",
        description: "Краткое описание первого эпизода.",
        duration: "25 мин",
        releaseDate: "1 января 2020",
        image: "https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
        videoUrl: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
        opening: {
          start: 10,
          end: 20
        },
        ending: [
          { start: 30, end: 40 }, // Первый эндинг (3:00 - 3:10)
          { start: 50, end: 60 }  // Второй эндинг (4:00 - 4:10)
        ]
      },
      {
        episodeNumber: 2,
        title: "Эпизод 2: Название эпизода 2",
        description: "Краткое описание второго эпизода.",
        duration: "30 мин",
        releaseDate: "8 января 2020",
        image: "https://i1.sndcdn.com/artworks-000005010194-jwzy1c-t500x500.jpg",
        videoUrl: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
        opening: {
          start: 0,
          end: 10
        },
        ending: [
          { start: 120, end: 130 }, // Первый эндинг (2:00 - 2:10)
          { start: 180, end: 190 }  // Второй эндинг (3:00 - 3:10)
        ]
      }
    ]
  },
  {
    seasonNumber: 2,
    title: "Название второго сезона",
    description: "Второй сезон с новыми историями.",
    episodes: [
      {
        episodeNumber: 1,
        title: "Эпизод 1: Название эпизода 1",
        description: "Описание первого эпизода второго сезона.",
        duration: "28 мин",
        releaseDate: "5 января 2021",
        videoUrl: "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8",
        image: "https://i1.sndcdn.com/artworks-000005010194-jwzy1c-t500x500.jpg",
        opening: {
          start: 5,
          end: 15
        },
        ending: [
          { start: 150, end: 160 }, // Первый эндинг (2:30 - 2:40)
          { start: 200, end: 210 }  // Второй эндинг (3:20 - 3:30)
        ]
      }
    ]
  }
];

let selectedSeason = seasons[0];

let playlist = selectedSeason.episodes;

var player = videojs(document.querySelector('video-js'), {
  controlBar: {
    children: ['playToggle',
			   'skipBackward',
			   'skipForward',
			   'volumePanel',
			   'currentTimeDisplay',
			   'timeDivider',
			   'durationDisplay',
			   'progressControl',
			   'liveDisplay',
			   'seekToLive',
			   'remainingTimeDisplay',
			   'customControlSpacer',
			   'playbackRateMenuButton',
			   'chaptersButton',
			   'descriptionsButton',
         'fullscreenToggle',
			   'audioTrackButton',
			   'qualityMenu',],
    skipButtons: {
      forward: 10,
      backward: 10
    },
    //volumePanel: {inline: false}
  },
  plugins: {
    qualityMenu: {} // Включение меню качества
  },
  enableSmoothSeeking: true,
  inactivityTimeout: 3000,
  preload: "metadata",
  autoplay: "", //for autoplay "muted"
  controls: true,
  responsive: true,
  fluid: true,
  liveui: true,
  language: 'ru',
  poster: '',
  techOrder: ["html5", "vhs"],
  html5: {
    vhs: {
      enableLowInitialPlaylist: true,
      fastQualityChange: true,
      overrideNative: true,
      useDevicePixelRatio: false,
      limitRenditionByPlayerDimensions: false,
    }
  },
	
});

var seasonSelectorContainer = document.createElement('div');
seasonSelectorContainer.className = 'vjs-season-selector-container';

var seasonButton = document.createElement('button');
seasonButton.className = 'vjs-season-button';
seasonButton.innerHTML = selectedSeason.seasonNumber + " сезон " + ' &#x25BC;';

var seasonMenu = document.createElement('ul');
seasonMenu.className = 'vjs-season-menu';

seasons.forEach(season => {
  var menuItem = document.createElement('li');
  menuItem.className = 'vjs-season-menu-item';
  menuItem.innerHTML = season.seasonNumber + " сезон";
  
  menuItem.addEventListener('click', function() {
    selectedSeason = season;
    playlist = selectedSeason.episodes;
    seasonButton.innerHTML = season.seasonNumber + " сезон " + ' &#x25BC;';
    seasonMenu.classList.remove('visible');

    updateSeasonDetails(selectedSeason);
    renderPlaylist(playlist);
  });
  
  seasonMenu.appendChild(menuItem);
});

seasonSelectorContainer.addEventListener('click', function() {
  if (seasonMenu.classList.contains('visible')) {
    seasonMenu.classList.remove('visible');
  } else {
    seasonMenu.classList.add('visible');
  }
});

seasonSelectorContainer.appendChild(seasonButton);
seasonSelectorContainer.appendChild(seasonMenu);

function updateSeasonDetails(season) {
  player.titleBar.update({
    title: ''+ season.seasonNumber +' сезон | '+ season.title,
    description: season.episodes[0].title
  })
}

// Кнопка для пропуска опенинга
var openingButton = document.createElement('button');
openingButton.innerHTML = 'Пропустить опенинг'; 
openingButton.className = 'vjs-opening-button'; 
openingButton.style.display = 'none'; 

document.querySelector('.video-js').appendChild(openingButton);

var endingButton = document.createElement('button');
endingButton.innerHTML = 'Пропустить эндинг'; 
endingButton.className = 'vjs-opening-button ending'; 
endingButton.style.display = 'none'; 

document.querySelector('.video-js').appendChild(endingButton);

player.on('timeupdate', function() {
  var currentTime = player.currentTime();
  var currentEpisode = seasons[0].episodes[0];

  // Проверяем, находимся ли мы в интервале опенинга
  if (currentTime >= currentEpisode.opening.start && currentTime <= currentEpisode.opening.end) {
      openingButton.style.display = 'block'; 
  } else {
      openingButton.style.display = 'none'; 
  }

  // Проверяем количество эндингов
  if (currentEpisode.ending.length > 0) {
      const firstEnding = currentEpisode.ending[0];

      // Если эндинг один, показываем кнопку пропуска
      if (currentEpisode.ending.length === 1) {
          if (currentTime >= firstEnding.start && currentTime <= firstEnding.end) {
              endingButton.style.display = 'block'; // Показать кнопку пропуска
          } else {
              endingButton.style.display = 'none'; // Скрыть кнопку, если не в интервале эндинга
          }
      }

      // Если эндингов больше одного, автоматически пропускаем первый
      if (currentEpisode.ending.length > 1) {
          if (currentTime >= firstEnding.start && currentTime <= firstEnding.end) {
              player.currentTime(firstEnding.end); // Автоматический пропуск первого эндинга
          }

          // Проверяем, есть ли второй эндинг и показываем кнопку для его пропуска
          const secondEnding = currentEpisode.ending[1];
          if (currentTime >= secondEnding.start && currentTime <= secondEnding.end) {
              endingButton.style.display = 'block'; // Показать кнопку пропуска второго эндинга
          } else {
              endingButton.style.display = 'none'; // Скрыть кнопку, если не во втором эндинге
          }
      }
  } else {
      endingButton.style.display = 'none'; // Скрыть кнопку, если эндингов нет
  }
});

openingButton.addEventListener('click', function() {
    var currentEpisode = seasons[0].episodes[0]; 
    player.currentTime(currentEpisode.opening.end); 
});

endingButton.addEventListener('click', function() {
  var currentEpisode = seasons[0].episodes[0];
  if (currentEpisode.ending.length > 0) {
      const lastEnding = currentEpisode.ending[currentEpisode.ending.length - 1];
      player.currentTime(lastEnding.end);
  }
});

var screenshotButton = player.controlBar.addChild('button');

// Присваиваем классы для стилизации
screenshotButton.addClass("vjs-icon-button");
screenshotButton.el().innerHTML = "<img src='src/images/camera.svg' alt='Сделать скриншот'>";
// Добавляем обработчик клика
screenshotButton.el().onclick = function() {
  var videoElement = player.el().getElementsByTagName('video')[0];
  var canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  var context = canvas.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Получаем изображение в формате base64
  var dataURL = canvas.toDataURL('image/png');

  // Создаем ссылку для скачивания
  var link = document.createElement('a');
  link.href = dataURL;
  link.download = 'screenshot.png'; // Название файла

  // Автоматически кликаем на ссылку
  link.click();
};

// Сохраняем последнюю позицию
player.on('pause', function() {
  localStorage.setItem('videoCurrentTime', player.currentTime());
});

// Восстанавливаем позицию при загрузке
player.on('loadedmetadata', function() {
  var lastPosition = localStorage.getItem('videoCurrentTime');
  if (lastPosition) {
    player.currentTime(lastPosition);
  }

  // Изменение названий звуковых дорожек по их ID
  var audioTracks = player.audioTracks();

  // Данные о звуковых дорожках
  var audioData = {
    names: [
      "JASKIER",         // ID 0
      "NewStudio",       // ID 1
      "AlexFilm",        // ID 2
      "Кубик в кубе",    // ID 3
      "Eng.Original"     // ID 4
    ],
    order: [
      3, // Позиция для "Кубик в кубе"
      1, // Позиция для "NewStudio"
      0, // Позиция для "AlexFilm"
      2, // Позиция для "JASKIER"
      4  // Позиция для "Eng.Original"
    ]
  };

  // Обновление названий звуковых дорожек
  if (audioTracks) {
    for (var i = 0; i < audioData.order.length; i++) {
      var trackId = audioData.order[i]; // Получаем ID трека из массива order
      if (audioTracks[trackId]) {
        audioTracks[trackId].label = audioData.names[i]; // Изменяем название
      }
    }

    // Установка звуковой дорожки по умолчанию
    var desiredTrackId = 3; // Замените на нужный ID звуковой дорожки (например, 3 для "Кубик в кубе")
    if (audioTracks[desiredTrackId]) {
      audioTracks[desiredTrackId].enabled = true; // Включаем нужную дорожку
    }
  }
});

// Title Bar
player.titleBar.update({
  title: ''+ selectedSeason.seasonNumber +' сезон | '+ selectedSeason.title,
  description: selectedSeason.episodes[0].title
})

// Переменная для хранения текущего индекса видео
let currentIndex = 0;

// Функция для обновления активного видео в плеере
function updateActiveVideo(index) {
  if (index >= 0 && index < playlist.length) {
      currentIndex = index;
      const video = playlist[index];
      player.pause(); // Остановка плеера перед сменой источника
      player.src([{ type: "application/x-mpegURL", src: video.videoUrl }]);
      player.poster(video.image); // Обновляем постер
      player.load(); // Загружаем новый источник
      player.currentTime(0);
      player.play();
      highlightActiveVideo();
  }
}


// Создаем меню плейлиста
var playlistMenu = document.createElement('div');
playlistMenu.className = 'vjs-playlist-menu';

// Добавляем кнопку плейлиста в controlBar
var playlistButton = document.createElement('button');
playlistButton.classList.add('vjs-icon-button');
playlistButton.innerHTML = '<img src="src/images/season.svg" alt="Открыть меню плейлиста">';
playlistButton.addEventListener('click', () => {
  document.querySelector('.player-container').classList.toggle('active-playlist');
  playlistMenu.classList.toggle('active');
});

// Создание навигации плейлиста
var playlistMenuNav = document.createElement('div');
playlistMenuNav.className = 'vjs-playlist-menu-nav';

// Поле поиска
var playlistMenuNavSearch = document.createElement('input');
playlistMenuNavSearch.className = 'vjs-playlist-menu-nav-search';
playlistMenuNavSearch.placeholder = 'Поиск';

// Обработчик поиска
playlistMenuNavSearch.addEventListener('input', function() {
  const searchTerm = playlistMenuNavSearch.value.toLowerCase();
  const filteredPlaylist = playlist.filter(item => item.title.toLowerCase().includes(searchTerm));
  renderPlaylist(filteredPlaylist);
});

// Кнопки навигации
var playlistMenuNavFirstVideoButton = document.createElement('button');
playlistMenuNavFirstVideoButton.className = 'vjs-playlist-menu-nav-btn';
playlistMenuNavFirstVideoButton.innerHTML = "<img src='src/images/skip-button.svg' alt='Первое видео'/>";
playlistMenuNavFirstVideoButton.title = "Первое видео";

var playlistMenuNavPrevVideoButton = document.createElement('button');
playlistMenuNavPrevVideoButton.className = 'vjs-playlist-menu-nav-btn rotate';
playlistMenuNavPrevVideoButton.innerHTML = "<img src='src/images/next-button.svg' alt='Предыдущее видео'/>";
playlistMenuNavPrevVideoButton.title = "Предыдущее видео";

var playlistMenuNavNextVideoButton = document.createElement('button');
playlistMenuNavNextVideoButton.className = 'vjs-playlist-menu-nav-btn';
playlistMenuNavNextVideoButton.innerHTML = "<img src='src/images/next-button.svg' alt='Следующее видео'/>";
playlistMenuNavNextVideoButton.title = "Следующее видео";

var playlistMenuNavLastVideoButton = document.createElement('button');
playlistMenuNavLastVideoButton.className = 'vjs-playlist-menu-nav-btn rotate';
playlistMenuNavLastVideoButton.innerHTML = "<img src='src/images/skip-button.svg' alt='Последнее видео'/>";
playlistMenuNavLastVideoButton.title = "Последнее видео";

// Добавляем обработчики событий для кнопок навигации
playlistMenuNavFirstVideoButton.addEventListener('click', () => {
  updateActiveVideo(0);
});

playlistMenuNavPrevVideoButton.addEventListener('click', () => {
  let newIndex = currentIndex - 1;
  if (newIndex < 0) newIndex = playlist.length - 1; // Цикличный переход к последнему видео
  updateActiveVideo(newIndex);
});

playlistMenuNavNextVideoButton.addEventListener('click', () => {
  let newIndex = currentIndex + 1;
  if (newIndex >= playlist.length) newIndex = 0; // Цикличный переход к первому видео
  updateActiveVideo(newIndex);
});

playlistMenuNavLastVideoButton.addEventListener('click', () => {
  updateActiveVideo(playlist.length - 1);
});

// Добавляем элементы в навигацию
playlistMenuNav.appendChild(playlistMenuNavSearch);
playlistMenuNav.appendChild(playlistMenuNavFirstVideoButton);
playlistMenuNav.appendChild(playlistMenuNavPrevVideoButton);
playlistMenuNav.appendChild(playlistMenuNavNextVideoButton);
playlistMenuNav.appendChild(playlistMenuNavLastVideoButton);

playlistMenu.appendChild(playlistMenuNav);

// Контейнер для списка видео
var playlistContainer = document.createElement('div');
playlistContainer.className = 'vjs-playlist-container';

// Функция для рендеринга плейлиста
function renderPlaylist(filteredPlaylist) {
  // Очищаем текущий плейлист
  playlistContainer.innerHTML = '';
  
  filteredPlaylist.forEach((video, index) => {
    var playlistVideoItem = document.createElement('div');
    playlistVideoItem.className = 'vjs-playlist-video';
    playlistVideoItem.dataset.index = playlist.indexOf(video); // Хранение оригинального индекса

    var playlistVideoItemImage = document.createElement('img');
    playlistVideoItemImage.src = video.image;
    playlistVideoItemImage.alt = "Обложка видео";

    var playlistVideoItemDescription = document.createElement('div');
    var playlistVideoItemDescriptionTitle = document.createElement('h3');
    playlistVideoItemDescriptionTitle.textContent = video.title;
    var playlistVideoItemDescriptionDescription = document.createElement('p');
    playlistVideoItemDescriptionDescription.textContent = video.description;
    playlistVideoItemDescription.appendChild(playlistVideoItemDescriptionTitle);
    playlistVideoItemDescription.appendChild(playlistVideoItemDescriptionDescription);

    playlistVideoItem.appendChild(playlistVideoItemImage);
    playlistVideoItem.appendChild(playlistVideoItemDescription);

    // Добавляем логику клика для смены видео
    playlistVideoItem.addEventListener('click', function() {
      const originalIndex = parseInt(this.dataset.index);
      updateActiveVideo(originalIndex);
      // Закрываем меню после выбора
      playlistMenu.classList.remove('active');
      document.querySelector('.player-container').classList.remove('active-playlist');
    });

    playlistContainer.appendChild(playlistVideoItem);
  });

  highlightActiveVideo();
}

// Функция для подсветки активного видео в списке
function highlightActiveVideo() {
  document.querySelectorAll('.vjs-playlist-video').forEach(item => {
    item.classList.remove('active');
    const index = parseInt(item.dataset.index);
    if (index === currentIndex) {
      item.classList.add('active');
    }
  });
}

// Первоначальный рендер плейлиста
renderPlaylist(playlist);
playlistMenu.appendChild(playlistContainer);

// Добавляем меню в player
document.querySelector('.video-js').appendChild(playlistMenu);

// Обновление классов для первого элемента
highlightActiveVideo();

// Автоматический переход к следующему видео по окончании текущего
player.on('ended', function() {
  let newIndex = currentIndex + 1;
  if (newIndex >= playlist.length) newIndex = 0;
  updateActiveVideo(newIndex);
});

var feedbackModal = document.createElement('div');

function closeFeedback() {
  feedbackModal.className = 'feedback-modal';
}

feedbackModal.innerHTML = 
'<form type="POST">' +
'<h1>Оставьте жалобу</h1>' +
'<textarea class="feedback-textarea" placeholder="Содержимое жалобы"></textarea>' +
'<div class="feedback-buttons">'+
'<button class="btn-primary" type="submit">Отправить</button>' +
'<button class="btn-second" type="button" onclick="closeFeedback();">Закрыть</button>' +
'</div>' +
'</form>';

feedbackModal.className = 'feedback-modal';

var feedbackModalBackground = document.createElement('div');
feedbackModalBackground.className = 'feedback-modal-background';
feedbackModalBackground.onclick = function() {
  closeFeedback();
}

feedbackModal.appendChild(feedbackModalBackground);

document.querySelector('.video-js').appendChild(feedbackModal);

var feedbackButton = player.controlBar.addChild('button');
feedbackButton.el().innerHTML = '<img src="src/images/feedback.svg" alt="Оставить жалобу"/>'; 
feedbackButton.el().className = 'vjs-icon-button'; 

feedbackButton.el().onclick = function() { 
  feedbackModal.className = 'feedback-modal show';
};

var brightnessSliderContainer = document.createElement('div');
brightnessSliderContainer.className = "vjs-brightness-container";

var brightnessSliderBackground = document.createElement('div');
brightnessSliderBackground.className = "vjs-brightness-slider-background";

var brightnessSliderButton = document.createElement('button');
brightnessSliderButton.className = "vjs-icon-button";
brightnessSliderButton.innerHTML = '<img src="src/images/brightness.svg" alt="Яркость"/>'; 

brightnessSliderButton.addEventListener('click', function() {
  brightnessSliderBackground.classList.toggle('visible');
});

// Добавляем ползунок яркости в controlBar
var brightnessSlider = document.createElement('input');
brightnessSlider.type = 'range';
brightnessSlider.className = 'vjs-brightness-slider';
brightnessSlider.min = 0;
brightnessSlider.max = 1;
brightnessSlider.step = 0.1;
brightnessSlider.value = 1; // Начальная яркость - 100%

// Функция для изменения яркости видео
brightnessSlider.addEventListener('input', function() {
    var videoElement = player.el().getElementsByTagName('video')[0];
    videoElement.style.filter = `brightness(${brightnessSlider.value})`;
});

brightnessSliderBackground.appendChild(brightnessSlider);
brightnessSliderContainer.appendChild(brightnessSliderBackground);
brightnessSliderContainer.appendChild(brightnessSliderButton);

// Добавляем ползунок в controlBar
player.controlBar.el().appendChild(brightnessSliderContainer);


var seasonSelector = document.createElement('span');
seasonSelector = 

/* Scripts i use for automatic get title and description
  title: document.title,
  description: document.querySelector('meta[name="description"]').content */

//You can change description for meta tag author 
// description: document.querySelector('meta[name="author"]').content

/*------------------*-------------------*/

//----------PLUGINS----------//
// Custom Loading Spinner Plugin
player.svgloadingspinner({
  image: "./svg/kinoteka-logo.svg", //Loading spinner image
  width: 300, //Loading spinner width
  height: 0,
  opacity: 1,
});

// Logo Plugin
player.logo({
  image: "./svg/ЛОГО.png", //Your Logo Image
  url: "https://1fdsf.ru", //URL Redirect when click logo
  fadeDelay: null, //null (always visible) or Milliseconds (1000 = 1 second)
  hideOnReady: false, //true or false
  position: "top-right", //top-left or right, bottom-left or right).
  width: 160,
  height: 0,
  padding: 5, //Padding around the logo image (px).
  opacity: 1,
  offsetH: 0, //Horizontal offset (px) from the edge of the video.
  offsetV: 0 //Vertical offset (px) from the edge of the video.
});
player.on("useractive", () => {
  player.logo().show();
}); //Show or hide
player.on("playing", () => {
  player.logo().show();
}); //Show or hide
player.on("pause", () => {
  player.logo().show();
});

// Control Bar Logo Plugin
player.logocontrolbar({
  image: "", //image 
  url: "", //url redirect when click
  width: 65, //change logo controlbar height
  height: 35, //change logo controlbar width
  opacity: 1,
});

// Mobile Ui Plugin
player.mobileUi({
  fullscreen: {
    enterOnRotate: true,
    exitOnRotate: true,
    lockOnRotate: true,
    lockToLandscapeOnEnter: true,
    iOS: true,
    disabled: false
  },
  touchControls: {
    seekSeconds: 10,
    tapTimeout: 300,
    disableOnEnd: false,
    disabled: false,
  }
});

// Плагин меню по щелчку правой кнопки
player.contextmenuUI({
  keepInside: true,
  content: [{
      href: '', // Ссылка
      label: 'Наш телеграм бот', // Название 
  },

    {
      href: '', // Ссылка
      label: 'Наш телеграм чат', // Название
  },
			
			{
      href: '', // Ссылка
      label: 'Горячие клавиши', // CНазвание
  },

    {
       // Кнопка с модальным окном
      label: 'url video',
      listener: function() {
        alert('ну и хули ты тут забыл?');
      }
  },
			
    {
      href: 'https://cerberus.vip', // Ссылка
      label: '© CERBERUS', // Название
   }]
});

player.spriteThumbnails({
  url: 'src/thumbnails/thumbnails.png',
  width: 160,
  height: 90,
  columns: 20,
  interval: 2
});

player.on('ready', function() {
  var controlBar = player.controlBar.el();

  var qualityMenuSettings = controlBar.querySelector('.vjs-quality-menu-wrapper');
  var audioMenuSettings = controlBar.querySelector('.vjs-audio-button');
  var playerFullscreenButton = controlBar.querySelector('.vjs-fullscreen-control');
  controlBar.insertBefore(playlistButton, playerFullscreenButton);
  controlBar.insertBefore(qualityMenuSettings, audioMenuSettings);
});

player.controlBar.el().appendChild(seasonSelectorContainer);

player.posterTime();