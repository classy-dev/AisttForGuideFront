import React, { useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Modal, { ModalProps } from 'Root/src/component/Modal';
import preferenceSlice, { IPreferenceState } from 'SliceFarm/preference';
import { useAppDispatch } from 'StoreFarm/index';
import { RootState } from 'StoreFarm/reducer';
import styled from '@emotion/styled';
import { guideApi } from 'ApiFarm/guide';
import { inferenceApi } from 'ApiFarm/inference';
import ServerStatusText from './ServerStatusText';

interface EditPreferenceProps extends ModalProps {}

const PreferenceWrapper = styled.div`
  max-width: 32rem;
  width: 100%;
  border-radius: 0.8rem;
  overflow: hidden;
  background-color: #fff;

  input {
    height: 3.2rem;
    border-radius: 0.4rem;
  }

  label {
    font-weight: 600;
  }
`;

const EditPreference = ({
  show,
  onClose,
  ...modalProps
}: EditPreferenceProps) => {
  const dispatch = useAppDispatch();

  const preferenceState = useSelector((state: RootState) => state.preference);

  const { register, handleSubmit } = useForm<IPreferenceState>({
    defaultValues: {
      ...preferenceState,
      hostname: preferenceState.hostname || 'http://localhost',
      direction: preferenceState.direction,
      GUIDE_PORT: preferenceState.GUIDE_PORT || 80,
      INFERENCE_PORT: preferenceState.INFERENCE_PORT || 5000,
      isDev: preferenceState.isDev || '0',
      isWeight: preferenceState.isWeight || '0',
    },
  });

  const handleSubmitPreference = handleSubmit(data => {
    dispatch(preferenceSlice.actions.setPreferenceAndSaveStorage(data));
    onClose();
  });

  // API 호출을 위한 baseURL 설정
  useLayoutEffect(() => {
    guideApi.defaults.baseURL = `${preferenceState.hostname}:${preferenceState.GUIDE_PORT}`;
  }, [preferenceState.hostname, preferenceState.GUIDE_PORT]);

  // API 호출을 위한 baseURL 설정
  useLayoutEffect(() => {
    inferenceApi.defaults.baseURL = `${preferenceState.hostname}:${preferenceState.INFERENCE_PORT}`;
  }, [preferenceState.hostname, preferenceState.INFERENCE_PORT]);

  return (
    <Modal show={show} onClose={onClose} {...modalProps}>
      <PreferenceWrapper>
        <div
          className={`flex-none px-[10px] w-full flex items-center justify-between border-b border-b-[#e5e5e5]`}
        >
          <h3 className="font-bold !text-lg !mb-0 py-4">설정</h3>
          <div className="inline-flex">
            <ServerStatusText />
          </div>
        </div>

        <form onSubmit={handleSubmitPreference}>
          <div className="flex flex-col pt-5 px-3">
            <label className="block font-medium text-sm mb-1">
              토핑 테이블 스크린
            </label>
            <div className="flex gap-2 py-2">
              <label className="w-full inline-flex items-center justify-center">
                <input
                  radioGroup="direction"
                  {...register('direction')}
                  type="radio"
                  value="left"
                  className="mr-2"
                />
                좌측 스크린
              </label>
              <label className="w-full  inline-flex items-center justify-center">
                <input
                  radioGroup="direction"
                  {...register('direction')}
                  type="radio"
                  value="right"
                  className="mr-2"
                />
                우측 스크린
              </label>
            </div>
          </div>
          <div className="flex flex-col pt-5 px-3">
            <label className="block font-medium text-sm mb-1">
              통신서버 호스트
            </label>
            <div className="flex">
              <input
                {...register('hostname')}
                type="url"
                formNoValidate
                className="px-1.5 border border-typo-4 w-full rounded h-6 text-sm"
              />
            </div>
            <div className="flex pt-2 gap-2">
              <div className="flex flex-col">
                <label className="block font-medium text-sm mb-1">
                  가이드버전 포트
                </label>
                <div className="flex">
                  <input
                    {...register('GUIDE_PORT')}
                    type="number"
                    formNoValidate
                    className="px-1.5 border border-typo-4 w-full rounded h-6 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="block font-medium text-sm mb-1">
                  모델 테스팅 포트
                </label>
                <div className="flex">
                  <input
                    {...register('INFERENCE_PORT')}
                    type="number"
                    formNoValidate
                    className="px-1.5 border border-typo-4 w-full rounded h-6 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col pt-5 px-3">
              <label className="block font-medium text-sm mb-1">
                디버그 모드
              </label>
              <div className="flex gap-2 py-2">
                <label className="w-full inline-flex items-center justify-center">
                  <input
                    radioGroup="isDev"
                    {...register('isDev')}
                    type="radio"
                    value="1"
                    className="mr-2"
                  />
                  사용
                </label>
                <label className="w-full  inline-flex items-center justify-center">
                  <input
                    radioGroup="isDev"
                    {...register('isDev')}
                    type="radio"
                    value="0"
                    className="mr-2"
                  />
                  사용안함
                </label>
              </div>
            </div>
            <div className="flex flex-col pt-5 px-3">
              <label className="block font-medium text-sm mb-1">
                무게 측정 모드
              </label>
              <div className="flex gap-2 py-2">
                <label className="w-full inline-flex items-center justify-center">
                  <input
                    radioGroup="isWeight"
                    {...register('isWeight')}
                    type="radio"
                    value="1"
                    className="mr-2"
                  />
                  사용
                </label>
                <label className="w-full  inline-flex items-center justify-center">
                  <input
                    radioGroup="isWeight"
                    {...register('isWeight')}
                    type="radio"
                    value="0"
                    className="mr-2"
                  />
                  사용안함
                </label>
              </div>
            </div>
            <div className="-mx-4 mt-4 py-2 px-4  flex justify-end items-center border-t border-t-[#e5e5e5]">
              <button
                type="submit"
                className="text-sm font-medium py-2 px-4 rounded-[0.4rem] bg-[#2264E5] text-white"
              >
                저장
              </button>
              <button
                type="button"
                className="text-sm font-medium py-2 px-4 rounded-[0.4rem] bg-[#5a6376] text-white ml-2"
                onClick={onClose}
              >
                취소
              </button>
            </div>
          </div>
        </form>
      </PreferenceWrapper>
    </Modal>
  );
};

export default EditPreference;
