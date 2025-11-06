import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private AUDIO_OK = new Audio('/sounds/ok.mp3');
  private AUDIO_WRONG = new Audio('/sounds/wrong.mp3');

  playOk() {
    this.playSound(this.AUDIO_OK);
  }
  playWrong() {
    this.playSound(this.AUDIO_WRONG);
  }

  private playSound(audio: HTMLAudioElement) {
    audio.currentTime = 0; // сброс, чтобы можно было кликать много раз
    audio.play().catch(err => { });
  }
}
