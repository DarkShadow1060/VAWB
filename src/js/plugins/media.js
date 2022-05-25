/*
    This is media Script 
    used for controlling media 
    Play pause 

    For the reference of the ACTIONS: go to src/js/langs/en.json

*/


import { executeScripts } from '../core';

// HELPER FUNCTION TO CTRL VIDEO

// SINCE A PAGE CAN CONTAIN MANY VIDEOS / AUDIOS WE ARE TAKING LISTS OF VIDEOS /AUDIOS
function forAllVideos(perVideoCommand) {
  return (
    `const videos = document.getElementsByTagName('video');
    for (let video of videos) {
      ${perVideoCommand}
    }`
    );
  }
// HELPER FUNCTION TO CTRL AUDIO
function forAllAudios(perAudioCommand) {
  return (
    `const audios = document.getElementsByTagName('audio');
    for (let audio of audios) {
      ${perAudioCommand}
    }`
  );
}


//   For the reference of the ACTIONS: go to src/js/langs/en.json

const commands = [
  { 
    action: 'MEDIA_PAUSE',
    callback: () => {
      executeScripts(
        // WILL PAUSE ALL THE VIDEOS/AUDIOS PLAYING IN CURRENT PAGE
        //NOTE THIS WILL ONLY WORK ON ACTIVE VIDEO 
        forAllVideos("video.pause();") + forAllAudios("audio.pause();")
      );
    }
  },

  { 
    action: 'MEDIA_PLAY',
    callback: () => {
      executeScripts(
        forAllVideos("video.play();") + forAllAudios("audio.play();")
      );
    }
  },

  { 
    action: 'MEDIA_VOLUME_UP',
    callback: () => {
      executeScripts(
        // WHEN THE MAX VALUE OF VOLUME IS REACHED THE MINIMUM WIL BE 1
        // ELSE THE MIN VALUE WILL BE video.volume + .2;
        forAllVideos("video.volume = Math.min(1, video.volume + .2);") +
        forAllAudios("audio.volume = Math.min(1, audio.volume + .2);")
      );
    }
  },

  {
    action: 'MEDIA_VOLUME_DOWN',
    callback: () => {
      executeScripts(
        // SAME LOGIC AS VOLUME UP (JUST OPPOSITE) VOLUME CAN'T BE -VE 
        forAllVideos("video.volume = Math.max(0, video.volume - .2);") +
        forAllAudios("audio.volume = Math.max(0, audio.volume - .2);")
      );
    }
  },

  {
    // THIS PART INCREASES THE VOLUME VALUE BY 80% DIRECTLY 
    action: 'MEDIA_VOLUME_LOUD',
    callback: () => {
      executeScripts(
        forAllVideos("video.volume = Math.max(1,video.volume+0.8);") +
        forAllAudios("audio.volume = Math.max(1,audio.volume+0.8);")
      );
    }
  },

  {
    // THIS SETS THE VOLUME TO 100%
    action: 'MEDIA_VOLUME_VERY_LOUD',
    callback: () => {
      executeScripts(
        forAllVideos("video.volume = 1;") +
        forAllAudios("audio.volume = 1;")
      );
    }
  },

  {
    action: 'MEDIA_VOLUME_QUIET',
    callback: () => {
      executeScripts(
        forAllVideos("video.volume = .2;") +
        forAllAudios("audio.volume = .2;")
      );
    }
  },
  // THE MUTING AND UNMUTING IS HANDELED BY ANOTHER FILE ie., tab_muter.js
  // {
  //   action: 'MEDIA_VOLUME_MUTE',
  //   callback: () => {
  //     executeScripts(
  //       forAllVideos("video.volume = 0;") +
  //       forAllAudios("audio.volume = 0;")
  //     );
  //   }
  // },
  // {
  //   action: 'MEDIA_VOLUME_UNMUTE',
  //   callback: () => {
  //     executeScripts(
  //       forAllVideos("video.volume = .5;") +
  //       forAllAudios("audio.volume = .5;")
  //     );
  //   }
  // },

  {
    action: 'MEDIA_FORWARD_SECONDS',
    callback: query => {
      let seconds = parseFloat(query);
      if (!(seconds > 0)) {
        seconds = 10;
      }
      executeScripts(
        forAllVideos("video.currentTime += " + seconds + ";") +
        forAllAudios("audio.currentTime += " + seconds + ";")
      );
    }
  },

  {
    action: 'MEDIA_BACKWARD_SECONDS',
    callback: query => {
      let seconds = parseFloat(query);
      if (!(seconds > 0)) {
        seconds = 10;
      }
      executeScripts(
        forAllVideos("video.currentTime -= " + seconds + ";") +
        forAllAudios("audio.currentTime -= " + seconds + ";")
      );
    }
  },

  {
    action: 'MEDIA_FORWARD_MINUTES',
    callback: query => {
      let minutes = parseFloat(query);
      if (!(minutes > 0)) {
        minutes = 1;
      }
      let seconds = minutes * 60;
      executeScripts(
        forAllVideos("video.currentTime += " + seconds + ";") +
        forAllAudios("audio.currentTime += " + seconds + ";")
      );
    }
  },

  {
    action: 'MEDIA_BACKWARD_MINUTES',
    callback: query => {
      let minutes = parseFloat(query);
      if (!(minutes > 0)) {
        minutes = 1;
      }
      let seconds = minutes * 60;
      executeScripts(
        forAllVideos("video.currentTime -= " + seconds + ";") +
        forAllAudios("audio.currentTime -= " + seconds + ";")
      );
    }
  },

  {
    action: 'MEDIA_FORWARD_1_MINUTE',
    callback: () => {
      let seconds = 60;
      executeScripts(
        forAllVideos("video.currentTime += " + seconds + ";") +
        forAllAudios("audio.currentTime += " + seconds + ";")
      );
    }
  },

  {
    action: 'MEDIA_BACKWARD_1_MINUTE',
    callback: () => {
      let seconds = 60;
      executeScripts(
        forAllVideos("video.currentTime -= " + seconds + ";") +
        forAllAudios("audio.currentTime -= " + seconds + ";")
      );
    }
  },

  {
    action: 'MEDIA_TO_BEGINNING',
    callback: () => {
      executeScripts(
        forAllVideos("video.currentTime = 0;") +
        forAllAudios("audio.currentTime = 0;")
      );
    }
  },

  {
    action: 'MEDIA_TO_END',
    callback: () => {
      executeScripts(
        forAllVideos("video.currentTime = video.duration;") +
        forAllAudios("audio.currentTime = audio.duration;")
      );
    }
  }
];

export default commands;
