export class Beeper {
    private  audio: any;

    constructor(){
        this.audio = new ((window as any).AudioContext ||
        (window as any).webkitAudioContext)();
    }

    beeper(key: number):void  {
        let oscillator = this.audio.createOscillator();
        oscillator.connect(this.audio.destination);
        oscillator.type = "square";
        const val = Math.pow(2, (key - 49) / 12) * 440;
        oscillator.frequency.setValueAtTime(val, this.audio.currentTime);
        oscillator.start();
        oscillator.stop(this.audio.currentTime + 0.1);
      }
}