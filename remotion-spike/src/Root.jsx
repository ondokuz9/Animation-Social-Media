import { Composition } from 'remotion';
import { Kapanis, KAPANIS_DURATION_S, FPS } from './Kapanis.jsx';

// The closing scene of the approved Evlek Reel v7, ported verbatim.
// In the approved reel it runs 18.05s → 21.55s; here it is its own 3.5s
// composition so it can be compared against the baseline checkpoints that fall
// inside it (t=19.50s → frame 87, t=21.30s → frame 195).
export const RemotionRoot = () => (
  <Composition
    id="Kapanis"
    component={Kapanis}
    durationInFrames={Math.round(KAPANIS_DURATION_S * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
