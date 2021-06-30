export class ENV {
    /*this config files will be read when you do normal development: 
      1, copy scripts folder and paste in root dir
      2, change ionic.config.json, add "hook": {"serve:before": "./scripts/serve-before.js","build:before":"./scripts/build-before.js"}
    */
  public static cordova_dependence = false;
  public static vconsole = true;
  public static console_overwrite = false;
}