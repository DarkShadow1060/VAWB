<!-- 
  This Page is Option page which asks the permission for Micro-Phone
-->
<script>
  import "../css/options.scss";
  import {
    mdiMicrophone,
    mdiTextToSpeech,
    mdiEmail,
    mdiEarHearing,
    mdiViewList,
    mdiThumbUp,
  } from "@mdi/js";
  import Card, { Content } from "@smui/card";
  import Button, { Label } from "@smui/button";
  import { fly } from "svelte/transition";
  import MdiIcon from "./MdiIcon.svelte";
  import OptionCard from "./OptionCard.svelte";
  import { ICON_COLOR, storage } from "../js/common";

  let voiceOption = {
    icon: mdiMicrophone,
    title: "Microphone permission",
    caption: "Allow microphone access to enable voice commands.",
    showScreenshot: true,
    errorCaption:
      "Voice command will not work without microphone access. Please click on the icon " +
      "at the right hand side of the URL bar to grant access.",
    onClick: (enabled) => {
      storage.set({ hotword: true });
      location.reload();
    },
  };

  let hotword = {
    icon: mdiMicrophone,
    title: '" Hey | Hey Bob | Bob " hotword detection',
    caption:
      'The Extension will Listen to  " Hey | Hey Bob | Bob " hotword in the background. To disable hotword detection CLICK HERE .',
    errorCaption:
      "Hotword detection is disabled. To enable hotword detection CLICK HERE",
    onClick: (enabled) => {
      storage.set({ hotword: enabled });
    },
  };

  let tts = {
    icon: mdiTextToSpeech,
    title: "Enable TEXT TO SPEECH ",
    caption:
      " Play voice response (TTS = Text To Speech ) on Google search result page if available. Note," +
      '"VAWB" will stop listening after performing a search result. To prevent Collision' +
      'You can trigger it again by saying the hotword or by clicking on the "VAWB" icon in browser extension area.',
    errorCaption:
      "Voice response is disabled. To enable automatically reading the voice response on Google search result. CLICK HERE",
    onClick: (enabled) => {
      storage.set({ tts: enabled });
    },
  };

  let autoOff = {
    icon: mdiEarHearing,
    title: "Stay listening",
    caption:
      "After a query is performed, stay listening for another 15 seconds without having to say HOTWORD again. " +
      'After 15 seconds of silence, the "VAWB" will stop listening.',
    errorCaption:
      '"VAWB" will stop listening after each query. Trigger it by saying the hotword or by clicking on the Extension Icon.',
    onClick: (enabled) => {
      storage.set({ autoOff: !enabled });
    },
  };

  function markInitialized() {
    storage.set({ hotword: true, init: true }, () => {
      chrome.tabs.update({
        url: "https://github.com/ayushmz29/vawb-chrome-extension",
      });
    });
  }

  storage.get(["tts", "hotword", "autoOff", "init"], (result) => {
    tts.enabled = result.tts;
    hotword.enabled = result.hotword;
    autoOff.enabled = !result.autoOff;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        voiceOption.enabled = true;
        if (!result.init) {
          markInitialized();
        }
      })
      .catch((error) => {
        voiceOption.enabled = false;
        const intervalHandle = setInterval(async () => {
          try {
            const hasMicAccess = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });
            voiceOption.enabled = true;
            storage.set({ hotword: true });
            if (!result.init) {
              markInitialized();
            }
            clearInterval(intervalHandle);
          } catch (ignored) {}
        }, 1000);
      });
  });
</script>

<div class="main-content ">
  <h1 class="mdc-typography--headline6">
    <div class="rotating" style="line-height: 100px; text-align: center;">
      <img class="logo" src="/img/icon_128.png" height="100" alt="Logo" />
    </div>
    <Button href="https://github.com/ayushmz29/vawb-chrome-extension">
      &nbsp;
      <Label class="logo-text">VAWB - Chrome Voice Assistant</Label>
    </Button>
  </h1>
  <div>
    <Button
      href="https://github.com/ayushmz29/vawb-chrome-extension#vawb-chrome-assistant"
      target="_blank"
    >
      <MdiIcon size="24" icon={mdiViewList} color={ICON_COLOR} />
      &nbsp;
      <Label color={ICON_COLOR}>All commands</Label>
    </Button>
    &nbsp;
    <Button
      href="https://github.com/ayushmz29/vawb-chrome-extension"
      target="_blank"
    >
      <MdiIcon size="24" icon={mdiThumbUp} color={ICON_COLOR} />
      &nbsp;
      <Label color={ICON_COLOR}>Give a star !</Label>
    </Button>
    &nbsp;
    <Button
      href="https://gist.github.com/ayushmz29/a81b00623ad6e9308f50146f2cfada48#file-gistfile1-txt"
      target="_blank"
    >
      <MdiIcon size="24" icon={mdiEmail} color={ICON_COLOR} />
      &nbsp;
      <Label color={ICON_COLOR}>Contact us!</Label>
    </Button>
  </div>

  <div class="transition-container" transition:fly={{ x: -200 }}>
    {#if !voiceOption.enabled}
      <Card class="card">
        <Content>
          <div class="mdc-typography--subtitle1">
            🎉 Thank you for installing VAWB 🎉
          </div>
          <div class="mdc-typography--subtitle2">
            We just need one more permission from you to access your microphone
          </div>
        </Content>
      </Card>
      <OptionCard option={voiceOption} />
    {:else}
      <OptionCard option={hotword} />
      <OptionCard option={tts} />
      <OptionCard option={autoOff} />
    {/if}
  </div>
</div>

<style>
  :global(.main-content) {
    margin: auto;
    padding: 5px;
    width: 800px;
    text-align: center;
  }

  :global(.hotword-input) {
    width: 400px;
  }

  :global(.reviews-button) {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  :global(.logo-text) {
    font-size: 1.5em;
  }

  .logo {
    vertical-align: middle;
  }

  .transition-container {
    position: absolute;
    width: 800px;
  }
  
/*
 */

 @-webkit-keyframes rotating /* Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 3s linear infinite;
  -moz-animation: rotating 3s linear infinite;
  -ms-animation: rotating 3s linear infinite;
  -o-animation: rotating 3s linear infinite;
  animation: rotating 3s linear infinite;
}

</style>
