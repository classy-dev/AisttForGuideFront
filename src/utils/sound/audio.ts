type InputType = string | File | Blob | ArrayBuffer;

const createAudioContext = () => {
  return new AudioContext({
    sampleRate: 44100,
  });
};

let prevSourceNode: null | AudioBufferSourceNode = null;
let ctx = createAudioContext();

// AudioContext를 반환하는 함수 (AudioContext는 한 번 닫히면 다시 열 수 없음)
export const getAudioContext = () => {
  if (ctx.state === 'closed') {
    ctx = createAudioContext();
  }

  return ctx;
};

// audio channel의 개수를 구하는 함수
const getMaxNumberOfChannels = (buffers: AudioBuffer[]) =>
  buffers.reduce((acc, cur) => Math.max(acc, cur.numberOfChannels), 0);

const getTotalLength = (buffers: AudioBuffer[]) =>
  buffers.reduce((acc, cur) => acc + cur.length, 0);

const fetchAudio = async (path: InputType) => {
  let buffer: ArrayBuffer;
  if (path instanceof File || path instanceof Blob) {
    buffer = await path.arrayBuffer();
  } else if (path instanceof ArrayBuffer) {
    buffer = path;
  } else {
    buffer = await fetch(path).then(res => res.arrayBuffer());
  }

  return ctx.decodeAudioData(buffer);
};

// audio 버퍼를 합쳐주는 함수
const concatAudio = (buffers: AudioBuffer[]): AudioBuffer => {
  const output = ctx.createBuffer(
    getMaxNumberOfChannels(buffers),
    getTotalLength(buffers),
    ctx.sampleRate
  );

  let offset = 0;

  buffers.forEach(buffer => {
    for (
      let channelNumber = 0;
      channelNumber < buffer.numberOfChannels;
      channelNumber += 1
    ) {
      output
        .getChannelData(channelNumber)
        .set(buffer.getChannelData(channelNumber), offset);
    }

    offset += buffer.length;
  });

  return output;
};

// audio 경로의 배열을 받아서 합쳐서 재생하는 함수
export const playConcatedAudio = async (audioList: InputType[]) => {
  try {
    if (prevSourceNode) {
      prevSourceNode.stop(0);
    }
    const buffers = await Promise.all(
      audioList.map(audio => fetchAudio(audio))
    );

    const buffer = concatAudio(buffers);

    const panner = new StereoPannerNode(ctx, { pan: 0.5 });
    const source = ctx.createBufferSource();

    source.buffer = buffer;
    source.connect(panner).connect(ctx.destination);
    source.start();

    prevSourceNode = source;

    return source;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
