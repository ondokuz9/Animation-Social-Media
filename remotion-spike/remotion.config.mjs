import { Config } from '@remotion/cli/config';

// Match the approved pipeline as closely as Remotion allows.
Config.setVideoImageFormat('png');       // lossless intermediate, as in the PNG sequence
Config.setPixelFormat('yuv420p');
Config.setCodec('h264');
Config.setChromiumOpenGlRenderer('swiftshader');
