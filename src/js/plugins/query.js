/* 
  This tab contains the Querys, what result happens if the user performs a Query 
*/

import cheerio from "cheerio";
import axios from "axios";
import { activeListening } from '../store';
import { openTabWithUrl, performActionWithDelay } from '../core';

// 3RD PARTY LIBRARY (HTTP client based request) 
async function loadAndParsePage(url) {
  const response = await axios.get(url);
  return cheerio.load(response.data);
}

// REFERENCE OF GOOGLE SEARCH URL 

/*
  https://www.google.com/search?
  q=youtube
  &
  sxsrf=ALiCzsah8XJ8nnRuFB2mt2weCIINJCzlOA%3A1653372421304
  &
  ei=BXaMYoisEv-VseMP9r69kAM&ved=0ahUKEwjIwumevPf3AhX_SmwGHXZfDzIQ4dUDCA4&uact=5
  &
  oq=youtube
  &
  gs_lcp=Cgdnd3Mtd2l6EAMyBAgjECcyBAgjECcyBAgjECcyEAguELEDEIMBEMcBENEDEEMyBAgA
  &
  sclient=gws-wiz
*/

// HELPER FUNCTION TO DIRECTLY OPEN A SITE 
async function generateGoogleLuckyUrl(query) {
  //Stack overflow 
  const parsedResponse = await loadAndParsePage("https://www.google.com/");
  const iflsig = parsedResponse("input[name='iflsig']").attr("value");
  const url = new URL("https://www.google.com/search");
  url.searchParams.set("q", query);
  // iflsig PREVENTS FROM REDIRECT NOTICE TO DIFFFERENT URL  
  url.searchParams.set("iflsig",iflsig);
  //ADDING btnI DIRECTLY OPENS THE FIRST LINK
  url.searchParams.set("btnI", "I'm Feeling Lucky");
  url.searchParams.set("autoplay",1);
  return url.href;
}


// Mapping Known Sites To their URL for Quick Fuctionality 
const siteToUrl = {
  Bing: "https://www.bing.com/search?q=",
  Yahoo: "https://search.yahoo.com/search?p=",
  Amazon: "https://www.amazon.com/",
  YouTube: "https://www.youtube.com/results?search_query=",
  Wikipedia: "https://www.wikipedia.org/wiki/"
};


// To Understand Actions see Scr/js/langs/en.json
const searchCommands = [];
for (const key in siteToUrl) {
  searchCommands.push({
    action: `QUERY_SEARCH_QUERY_ON_${key.toUpperCase()}`,
    callback: query => {
      openTabWithUrl(siteToUrl[key] + query);
    },
    priority: 0.3
  });
}

const commands = [
  {
    action: 'QUERY_SEARCH_IMAGE',
    callback: query => {
      openTabWithUrl(
        "https://www.google.com/search?tbm=isch&q=" + query
      );
    }
  },
  {
    action: 'QUERY_SEARCH_NEWS',
    callback: query => {
      openTabWithUrl(
        "https://www.google.com/search?tbm=nws&q=" + query
      );
    }
  },
  {
    action: 'QUERY_NEWS',
    callback: () => {
      openTabWithUrl("https://news.google.com/");
    }
  },
  {
    action: 'QUERY_SEARCH_MAP',
    callback: query => {
      openTabWithUrl("https://www.google.com/maps?q=" + query);
    }
  },

  {
    action: 'QUERY_SEARCH_DIRECTION_FROM_TO',
    callback: (from, to) => {
      performActionWithDelay(() => {
        openTabWithUrl(
          "https://www.google.com/maps/dir/" + from + "/" + to
        );
      });
    }
  },

  {
    action: 'QUERY_SEARCH_DIRECTION_FROM',
    callback: query => {
      openTabWithUrl("https://www.google.com/maps/dir/" + query);
    }
  },

  {
    action: 'QUERY_SEARCH_DIRECTION_TO',
    callback: query => {
      openTabWithUrl("https://www.google.com/maps/dir//" + query);
    }
  },
  {
    action: 'QUERY_GO_TO_WIKIPEDIA',
    callback: () => {
      openTabWithUrl("https://wikipedia.org/");
    }
  },
  {
    action: 'QUERY_SEARCH_WIKIPEDIA',
    callback: query => {
      openTabWithUrl(
        "https://en.wikipedia.org/wiki/Special:Search/" + query
      );
    }
  },
  {
    action: 'QUERY_GO_TO_VIDEO',
    callback: () => {
      openTabWithUrl("https://www.youtube.com/");
    }
  },
  {
    action: 'QUERY_SEARCH_VIDEO',
    callback: query => {
      openTabWithUrl(
        "https://www.youtube.com/results?search_query=" + query
      );
    }
  },
  {
    action: 'QUERY_GO_TO_MUSIC',
    callback: () => {
      openTabWithUrl("https://play.google.com/music/listen");
    }
  },
  {
    action: 'QUERY_GO_TO_SHOPPING',
    callback: () => {
      openTabWithUrl("https://www.amazon.in/?");
    }
  },
  {
    action: 'QUERY_SEARCH_SHOPPING',
    callback: query => {
      openTabWithUrl(
        "https://www.amazon.in/s?k=" + query
      );
    }
  },
  {
    action: 'QUERY_GO_TO_DOWNLOADS',
    callback: () => {
      openTabWithUrl("chrome://downloads");
    }
  },

  {
    action: 'QUERY_GO_TO_BOOKMARKS',
    callback: () => {
      openTabWithUrl("chrome://bookmarks");
    }
  },

  {
    action: 'QUERY_GO_TO_HISTORY',
    callback: () => {
      openTabWithUrl("chrome://history");
    }
  },

  {
    action: 'QUERY_GO_TO_QUERY',
    callback: async query => {
      openTabWithUrl(await generateGoogleLuckyUrl(query));
    }
  },
  ...searchCommands,
  {
    action: 'QUERY_SEARCH_QUERY_ON_SITE',
    callback: async (query, site) => {
      openTabWithUrl(
        await generateGoogleLuckyUrl(query + " on " + site)
      );
    },
    priority: 0.3
  },
  {
    action: 'QUERY_SEARCH_QUERY',
    callback: query => {
      chrome.storage.local.get(["tts"], result => {
        // If TTS is enabled, we need to clear notifications to avoid the TTS to feedback into the command.
        if (result.tts) {
          openTabWithUrl(
            "https://www.google.com/search?gs_ivs=1&q=" +
            encodeURIComponent(query)
          );
          activeListening.set(false);
        } else {
          openTabWithUrl(
            "https://www.google.com/search?q=" +
            encodeURIComponent(query)
          );
        }
      });
    },
    priority: 0.2
  }
];

export default commands;

