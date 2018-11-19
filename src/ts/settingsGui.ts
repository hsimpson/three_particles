import * as $ from 'jquery';
import * as THREE from 'three';
import * as tinycolor from 'tinycolor2';
require('spectrum-colorpicker'); // tslint:disable-line:no-var-requires

export interface ISettings {
  particlesPerDimension: number;
  gravity: number;
  particleSize: number;
  force: number;
  forceActive: boolean;
  forcePosition?: THREE.Vector3;
  color: tinycolor.Instance;
}

export class SettingsGui {
  private _settingsPanel: JQuery<HTMLElement>;
  private _settingsButton: JQuery<HTMLElement>;

  private _particleCountSlider: JQuery<HTMLInputElement>;
  private _particleCountText: JQuery<HTMLElement>;

  private _gravitySlider: JQuery<HTMLInputElement>;
  private _gravityText: JQuery<HTMLElement>;

  private _particleSizeSlider: JQuery<HTMLInputElement>;
  private _particleSizeText: JQuery<HTMLElement>;

  private _forceSlider: JQuery<HTMLInputElement>;
  private _forceText: JQuery<HTMLElement>;

  private _colorPicker: JQuery<HTMLInputElement>;
  private _perf: JQuery<HTMLElement>;
  private _totalParticle: JQuery<HTMLElement>;
  private _settings: ISettings;

  constructor() {
    this._settingsButton = $('#settingsButton');
    this._settingsPanel = $('#settings');

    this._particleCountSlider = this._settingsPanel.find('#particleCount') as JQuery<HTMLInputElement>;
    this._particleCountText = this._settingsPanel.find('#particleCountText');

    this._gravitySlider = this._settingsPanel.find('#gravity') as JQuery<HTMLInputElement>;
    this._gravityText = this._settingsPanel.find('#gravityText');

    this._particleSizeSlider = this._settingsPanel.find('#particleSize') as JQuery<HTMLInputElement>;
    this._particleSizeText = this._settingsPanel.find('#particleSizeText');

    this._forceSlider = this._settingsPanel.find('#force') as JQuery<HTMLInputElement>;
    this._forceText = this._settingsPanel.find('#forceText');

    this._colorPicker = this._settingsPanel.find('#colorPicker') as JQuery<HTMLInputElement>;
    this._perf = this._settingsPanel.find('#perf');
    this._totalParticle = this._settingsPanel.find('#totalParticle');

    this._colorPicker.spectrum({
      containerClassName: 'colorpicker',
      flat: true,
      move: (color) => {
        this._settings.color = color;
      },
      preferredFormat: 'rgb',
      showAlpha: true,
      showButtons: false,
      showInitial: false,
      showInput: false
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

    this.setDefault();
  }

  public getSettings(): ISettings {
    return this._settings;
  }

  public updateFrames(delta: number) {
    this._perf.html(delta.toFixed(2));
  }

  private setDefault(): void {
    if (!this._settings) {
      this._settings = {
        color: tinycolor({ r: 255, g: 0, b: 0, a: 1.0 }),
        force: 0.1,
        forceActive: false,
        forcePosition: new THREE.Vector3(),
        gravity: 0.98,
        particleSize: 1.0,
        particlesPerDimension: 10
      };
    } else {
      this._settings.color = tinycolor({ r: 255, g: 0, b: 0, a: 1.0 });
      this._settings.force = 0.1;
      this._settings.forceActive = false;
      this._settings.forcePosition.set(0, 0, 0);
      this._settings.gravity = 0.98;
      this._settings.particleSize = 1.0;
      this._settings.particlesPerDimension = 10;
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

    this._colorPicker.spectrum('set', this._settings.color.toHexString());
  }
}
