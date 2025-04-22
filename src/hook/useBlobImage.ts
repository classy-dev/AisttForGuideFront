import { useLayoutEffect, useState } from 'react';

const useBlobImage = () => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobImageURL, setBlobImageURL] = useState<string | null>(null);

  // blob URL 생성
  useLayoutEffect(() => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    setBlobImageURL(url);
  }, [blob]);

  // 컴포넌트가 언마운트 되면 blob URL 해제
  useLayoutEffect(() => {
    if (!blobImageURL) return () => {};

    return () => URL.revokeObjectURL(blobImageURL ?? '');
  }, [blobImageURL]);

  return [blobImageURL, setBlob] as [string | null, typeof setBlob];
};

export default useBlobImage;
