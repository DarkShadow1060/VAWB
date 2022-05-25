/*
 * This file basically uses chrome storage API and stores the value in local storage
 * HOT WORD is  also stored here 
 * Hot Word => hey , hey BOB , BOB
 * 
 * Custom Hot Word will be added in next Update
 * 
 */


import { derived, get, writable } from 'svelte/store';
import { storage } from './common';

export const activeListening = writable(false);
export const hotwordEnabled = writable(false);


export const speechRecognitionEnabled = derived(
  [activeListening, hotwordEnabled],
	([$activeListening, $hotwordEnabled]) => {
    return $activeListening || $hotwordEnabled;
  }
);

export function isActiveListening() {
  return get(activeListening);
}


export function isHotwordEnabled() {
  return get(hotwordEnabled);
}

export function getHotwords() {
  const hotwords = ['hey','HEY BOB',"Hi BOB",'bob', "hello bob"];

  return hotwords;
}

storage.get(["hotword"], result => {
  hotwordEnabled.set(result.hotword);
});

