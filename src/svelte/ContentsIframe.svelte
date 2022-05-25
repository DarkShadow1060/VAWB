<script>
  const url = chrome.runtime.getURL("/notification_ui.html");
  let showIframe = false;

  chrome.runtime.onMessage.addListener(request => {
    switch (request.type) {
      case "START_LISTENING":
      case "PENDING_RESULT":
      case "RESULT":
        showIframe = true;
        break;
      case "CLEAR_NOTIFICATION":
        setTimeout(() => {
          showIframe = false;
        }, 500);
        break;
    }
  });
</script>

<style>
  .chrome-voice-assistant {
    background-color: #373738;
    border-radius: 6px;
    position: fixed;
    width: 30%;
    height: 30%;
    bottom: 0.2%;
    right: 0.1%;
    z-index: 1000000;
    margin: 0%;
  }

  .chrome-voice-assistant-hidden {
    display: none;
  }
</style>

<iframe
  class="chrome-voice-assistant {showIframe ? '' : 'chrome-voice-assistant-hidden'} text-center text-white"
  seamless
  src={url}
  title="VAWB - Chrome Voice Assistant" />
