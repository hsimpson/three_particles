import * as THREE from 'three';
import $ from 'jquery';
import Picker from 'vanilla-picker';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
//const Picker = require('vanilla-picker');

export interface ISettings {
  particlesPerDimension: number;
  gravity: number;
  particleSize: number;
  force: number;
  forceActive: boolean;
  forcePosition?: THREE.Vector3;
  color: THREE.Vector4;
}

export class SettingsGui {
  private _settingsPanel: JQuery<HTMLElement>;
  private _settingsButton: JQuery<HTMLElement>;

  private _particleCountSlider: JQuery<HTMLInputElement>;
  private _particleCountText: JQuery<HTMLSpanElement>;

  private _gravitySlider: JQuery<HTMLInputElement>;
  private _gravityText: JQuery<HTMLSpanElement>;

  private _particleSizeSlider: JQuery<HTMLInputElement>;
  private _particleSizeText: JQuery<HTMLSpanElement>;

  private _forceSlider: JQuery<HTMLInputElement>;
  private _forceText: JQuery<HTMLSpanElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _colorPicker: any;
  private _perf: JQuery<HTMLSpanElement>;
  private _totalParticle: JQuery<HTMLSpanElement>;
  private _settings: ISettings;

  constructor() {
    this._settingsButton = $('#settingsButton');
    this._settingsPanel = $('#settings');

    this._particleCountSlider = this._settingsPanel.find('#particleCount') as JQuery<HTMLInputElement>;
    this._particleCountText = this._settingsPanel.find('#particleCountText') as JQuery<HTMLSpanElement>;

    this._gravitySlider = this._settingsPanel.find('#gravity') as JQuery<HTMLInputElement>;
    this._gravityText = this._settingsPanel.find('#gravityText') as JQuery<HTMLSpanElement>;

    this._particleSizeSlider = this._settingsPanel.find('#particleSize') as JQuery<HTMLInputElement>;
    this._particleSizeText = this._settingsPanel.find('#particleSizeText') as JQuery<HTMLSpanElement>;

    this._forceSlider = this._settingsPanel.find('#force') as JQuery<HTMLInputElement>;
    this._forceText = this._settingsPanel.find('#forceText') as JQuery<HTMLSpanElement>;

    this._perf = this._settingsPanel.find('#perf') as JQuery<HTMLSpanElement>;
    this._totalParticle = this._settingsPanel.find('#totalParticle') as JQuery<HTMLSpanElement>;

    this._colorPicker = new Picker({
      parent: this._settingsPanel.find('#colorPicker')[0],
      popup: false,
      alpha: true,
      editor: false,
      color: '#ff0000',
      onChange: (color): void => {
        const rgba = color.rgba;
        if (this._settings) {
          this._settings.color.set(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]);
        }
      },
    });

    this._settingsButton.on('click', () => {
      const settingsButtonIcon = this._settingsButton.find('[data-fa-i2svg]');
      this._settingsPanel.toggleClass('visible');
      this._settingsButton.toggleClass('moved');

      settingsButtonIcon.toggleClass('fa-bars');
      settingsButtonIcon.toggleClass('fa-times-circle');
    });

    this._settingsPanel.find('#btnSetDefault').on('click', () => {
      this.setDefault();
    });

    this._particleCountSlider.on('input change', () => {
      this._settings.particlesPerDimension = this._particleCountSlider.val() as number;
      this.updateGUI();
    });

    this._gravitySlider.on('input change', () => {
      this._settings.gravity = this._gravitySlider.val() as number;
      this.updateGUI();
    });

    this._particleSizeSlider.on('input change', () => {
      this._settings.particleSize = this._particleSizeSlider.val() as number;
      this.updateGUI();
    });

    this._forceSlider.on('input change', () => {
      this._settings.force = this._forceSlider.val() as number;
      this.updateGUI();
    });

    this._settingsPanel.find('input').on('keydown', (e) => {
      e.preventDefault();
    });

    this.setDefault();
  }

  public getSettings(): ISettings {
    return this._settings;
  }

  public updateFrames(delta: number): void {
    this._perf.html(`${delta.toFixed(2)} (${(1000 / delta).toFixed(1)} FPS)`);
  }

  private setDefault(): void {
    if (!this._settings) {
      this._settings = {
        color: new THREE.Vector4(1.0, 0.0, 0.0, 1.0),
        force: 0.1,
        forceActive: false,
        forcePosition: new THREE.Vector3(),
        gravity: 0.98,
        particleSize: 1.0,
        particlesPerDimension: 50,
      };
    } else {
      this._settings.color.set(1.0, 0.0, 0.0, 1.0);
      this._settings.force = 0.1;
      this._settings.forceActive = false;
      this._settings.forcePosition.set(0, 0, 0);
      this._settings.gravity = 0.98;
      this._settings.particleSize = 1.0;
      this._settings.particlesPerDimension = 50;
    }

    this.updateGUI();
  }

  private updateGUI(): void {
    this._particleCountSlider.val(this._settings.particlesPerDimension);
    this._particleCountText.html(this._settings.particlesPerDimension.toString());
    this._totalParticle.html(Math.pow(this._settings.particlesPerDimension, 3).toLocaleString());

    this._gravitySlider.val(this._settings.gravity);
    this._gravityText.html(this._settings.gravity.toString());

    this._particleSizeSlider.val(this._settings.particleSize);
    this._particleSizeText.html(this._settings.particleSize.toString());

    this._forceSlider.val(this._settings.force);
    this._forceText.html(this._settings.force.toString());

    const rgba = this._settings.color.toArray();
    rgba[0] *= 255;
    rgba[1] *= 255;
    rgba[2] *= 255;

    this._colorPicker.setColor(rgba, true);
  }
}
