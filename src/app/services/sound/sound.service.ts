import { computed, Injectable, signal } from '@angular/core';
import { SOUND_SETTINGS } from 'constants';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private AUDIO_OK = new Audio('/sounds/ok.mp3');
  private AUDIO_WRONG = new Audio('/sounds/wrong.mp3');

  private on_off = signal<string>(SOUND_SETTINGS.ON);
  isOn = computed(() => this.on_off() === SOUND_SETTINGS.ON);

  playOk() {
    this.playSound(this.AUDIO_OK);
  }
  playWrong() {
    this.playSound(this.AUDIO_WRONG);
  }

  private playSound(audio: HTMLAudioElement) {
    if (!this.isOn()) return;
    audio.currentTime = 0; // сброс, чтобы можно было кликать много раз
    audio.play().catch(err => { });
  }

  toggle() {
    this.on_off.update(t => t == SOUND_SETTINGS.ON ? SOUND_SETTINGS.OFF : SOUND_SETTINGS.ON);
  }
}
