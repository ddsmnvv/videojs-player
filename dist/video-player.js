let seasons = [
  {
      seasonNumber: 1,
      title: "Сезон 1",
      description: "Первый сезон, в котором начинается история.",
      episodes: [
          {
              episodeNumber: 1,
              title: "Эпизод 1: Название эпизода 1",
              description: "Краткое описание первого эпизода.",
              duration: "25 мин",
              releaseDate: "1 января 2020",
              videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              opening: {
                  start: 10,
                  end: 20
              },
              ending: [
                  { start: 180, end: 190 }, // Первый эндинг (3:00 - 3:10)
                  { start: 240, end: 250 }  // Второй эндинг (4:00 - 4:10)
              ]
          },
          {
              episodeNumber: 2,
              title: "Эпизод 2: Название эпизода 2",
              description: "Краткое описание второго эпизода.",
              duration: "30 мин",
              releaseDate: "8 января 2020",
              videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
  }
];

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
			   'audioTrackButton',
			   'QualitySelector',
			   'fullscreenToggle'],
    skipButtons: {
      forward: 10,
      backward: 10
    },
    //volumePanel: {inline: false}
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

// Кнопка для пропуска опенинга
var openingButton = document.createElement('button');
openingButton.innerHTML = 'Пропустить опенинг'; 
openingButton.className = 'vjs-opening-button'; 

openingButton.style.position = 'absolute';
openingButton.style.bottom = '15%'; 
openingButton.style.left = '20px'; 
openingButton.style.zIndex = '1000'; 
openingButton.style.display = 'none'; 

document.querySelector('.video-js').appendChild(openingButton);


var endingButton = document.createElement('button');
endingButton.innerHTML = 'Пропустить эндинг'; 
endingButton.className = 'vjs-opening-button'; 

endingButton.style.position = 'absolute';
endingButton.style.bottom = '15%'; 
endingButton.style.left = '20px'; 
endingButton.style.zIndex = '1000'; 
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

var myButton = player.controlBar.addChild('button');

// Присваиваем классы для стилизации
myButton.addClass("vjs-screenshot-button");
myButton.addClass("html-classname");
myButton.el().innerHTML = "Сделать скриншот";
// Добавляем обработчик клика
myButton.el().onclick = function() {
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
  title: 'Американский папаша',
  description: '1 сезон 3 серия'
})

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

// Contrib Quality Menu Plugin
player.qualityMenu({
  useResolutionLabels: true,
});

/*
// Quality Selector Plugin
player.hlsQualitySelector({
  autoPlacement: "bottom",
  displayCurrentQuality: true,
  getCurrentQuality: "auto",
  sortAscending: false,
  vjsIconClass: "vjs-icon-cog",
}); */

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

player.posterTime();
