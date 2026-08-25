/**
 * Tiny WebAudio synth for UI feedback — no audio files needed.
 * Ported from the approved mockup (rising chime = lights on).
 */

/** Rising phosphor chime played when the Konami overdrive unlocks. */
export function playSurgeChime() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.11, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);

    // sparkle blip on top
    const blip = ctx.createOscillator();
    const blipGain = ctx.createGain();
    blip.type = 'square';
    blip.frequency.value = 1250;
    blipGain.gain.setValueAtTime(0.05, t);
    blipGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    blip.connect(blipGain).connect(ctx.destination);
    blip.start(t);
    blip.stop(t + 0.06);

    // release the context once the chime finishes
    setTimeout(() => ctx.close().catch(() => {}), 400);
  } catch {
    /* audio unavailable — silent fallback */
  }
}
