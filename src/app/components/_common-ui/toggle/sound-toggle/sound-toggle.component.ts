import { Component } from '@angular/core';
import { ThemeService } from '@services/theme/theme.service';
import { SvgIconComponent } from "@components/_common-ui/svg-icon/svg-icon.component";
import { SVG_ICON } from '@components/svg-icon.constants';
import { SOUND_SETTINGS } from 'constants';
import { SoundService } from '@app/services/sound/sound.service';

@Component({
  selector: 'app-sound-toggle',
  imports: [SvgIconComponent],
  templateUrl: './sound-toggle.html',
  styleUrl: './sound-toggle.scss'
})
export class SoundToggleComponent {
  SOUND_SETTINGS = SOUND_SETTINGS;
  ICON = SVG_ICON;

  constructor(
    public soundService: SoundService
  ) {}
}