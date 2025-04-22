import React from 'react';
import { useSelector } from 'react-redux';
import { ISpeechMessage } from 'SliceFarm/messageQueue';
import { RootState } from 'StoreFarm/reducer';
import { playConcatedAudio } from 'UtilFarm/sound/audio';
import { synthesizeSpeech } from 'UtilFarm/sound/polly';

const audio = new Audio();

const playEffectAudio = async (effectType: string) => {
  audio.src = `/audio/${effectType}.mp3`;
  audio.play();

  return new Promise((resolve, reject) => {
    audio.onended = resolve;
    audio.onerror = reject;
  });
};

const useSpeak = () => {
  const GUIDE_URL = useSelector(
    (state: RootState) =>
      `${state.preference?.hostname}:${state.preference.GUIDE_PORT}`
  );

  const popSpeak = React.useCallback(
    async (messageInfo: ISpeechMessage) => {
      try {
        const audioBuffer = await synthesizeSpeech(
          messageInfo.message.replace(/(\(.*\))/, '')
        );

        if (messageInfo.type === 'warning') {
          return messageInfo.beforeEffect
            ? playEffectAudio(messageInfo?.effectType ?? '').then(() =>
                playConcatedAudio([audioBuffer])
              )
            : playConcatedAudio([audioBuffer]);
        } else {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async resolve => {
            const node = (await playConcatedAudio(
              messageInfo.beforeEffect
                ? [`/audio/${messageInfo.effectType}.mp3`, audioBuffer]
                : [audioBuffer]
            )) as AudioBufferSourceNode;

            if (node) {
              node.addEventListener('ended', () => {
                resolve(node);
              });
            } else {
              resolve(node);
            }
          });
        }
      } catch (e) {
        return null;
      }
    },
    [GUIDE_URL]
  );

  return popSpeak;
};

export default useSpeak;
