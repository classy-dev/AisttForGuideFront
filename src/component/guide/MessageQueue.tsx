import React, { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import messageQueueSlice, { ISpeechMessage } from 'SliceFarm/messageQueue';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import useSpeak from 'HookFarm/useSpeak';
import { getAudioContext } from 'UtilFarm/sound/audio';

const bgClasses: { [key: string]: string } = {
  warning: 'text-[#FF4600]',
  alert: 'text-[#5A6376]',
  normal: 'text-[#5A6376]',
};

let isSpeaking = false;
let sourceNode: null | AudioBufferSourceNode = null;

const duration = 500;

const MessageBoxWrapper = styled.div`
  flex: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  padding: 2.4rem 0;
  min-height: 3.6rem;
  box-sizing: content-box;
`;

const MessageBox = styled.div`
  position: absolute;
  bottom: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  user-select: none;
  font-size: 3rem;
  line-height: 1.25;
  word-break: keep-all;
  white-space: pre;
  padding: 0 2.4rem 2.4rem;
`;

const MessageQueue = () => {
  const messageRef = useRef<ISpeechMessage[]>([]);

  const popSpeak = useSpeak();
  const dispatch = useDispatch();

  const [currentMessage, setCurrentMessage] = useState<ISpeechMessage | null>(
    null
  );

  const isStart = useSelector((state: RootState) => state.guide.isStart);
  const isEnd = useSelector((state: RootState) => state.guide.isEnd);
  const isDoughStep = useSelector(
    (state: RootState) =>
      Number(
        state.guide.topping_steps?.[state.guide?.currentStep]?.ai_step_code
      ) === 26
  );

  const missionMessage = useSelector(
    (state: RootState) =>
      state.guide.topping_steps?.[state.guide?.currentStep]?.alerts?.start ?? ''
  );

  const messages = useSelector(
    (state: RootState) => state.messageQueue.messages
  );

  React.useEffect(() => {
    messageRef.current = messages;
  }, [messages]);

  React.useEffect(
    () => () => {
      isSpeaking = false;
      if (sourceNode) {
        sourceNode.buffer = null;
        sourceNode.disconnect();
      }

      getAudioContext()
        .suspend()
        .then(() => {
          getAudioContext().close();
          sourceNode = null;
        });
    },
    []
  );

  // 반복적으로 message queue를 체크하여 음성을 출력
  React.useEffect(() => {
    let unmounted = false;
    if (messages.length === 0) return;

    const repeatSpeak = async (): Promise<any> => {
      if (isSpeaking || unmounted) return Promise.resolve();

      const messageList = messageRef.current ?? [];
      const message = messageList[0];
      dispatch(messageQueueSlice.actions.shift());

      if (!message || message.message === currentMessage?.message)
        return Promise.resolve();

      setCurrentMessage(message);

      if (message.type === 'alert') {
        isSpeaking = true;
      }

      popSpeak(message)
        .then(node => {
          sourceNode = node as AudioBufferSourceNode;
          const updateMessage = (prev: ISpeechMessage | null) =>
            prev?.message === message.message ? null : prev;

          if (message.type === 'warning' && sourceNode) {
            sourceNode.onended = () => {
              setCurrentMessage(updateMessage);
            };
          } else {
            setCurrentMessage(updateMessage);
          }
        })
        .finally(() => {
          isSpeaking = false;
          repeatSpeak();
        });
    };

    repeatSpeak();

    return () => {
      // unmounted = true;
    };
  }, [!!messages.length]);

  const key = useMemo(() => {
    switch (true) {
      case isEnd:
        return 'end';
      case currentMessage?.type === 'warning':
        return currentMessage?.message;
      case !!missionMessage:
        return missionMessage;
      default:
        return '';
    }
  }, [currentMessage, missionMessage, isStart, isEnd]);

  return (
    <MessageBoxWrapper>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={key}
          timeout={duration}
          classNames={'message-queue'}
        >
          <>
            {/** message queue에 메세지 있을때 */}
            {!isDoughStep && !isEnd && currentMessage?.type === 'warning' && (
              <MessageBox className={bgClasses[currentMessage?.type]}>
                {currentMessage.message.replace(',', ',\n')}
              </MessageBox>
            )}
            {!isDoughStep && !isEnd && currentMessage?.type !== 'warning' && (
              <MessageBox className={bgClasses['normal']}>
                {missionMessage.replace(',', ',\n')}
              </MessageBox>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </MessageBoxWrapper>
  );
};

export default MessageQueue;
