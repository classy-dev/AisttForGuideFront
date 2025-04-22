import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { blobToBase64 } from 'UtilFarm/file';

const InferenceImageStyle = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  width: 320px;
  margin: 0 0.3rem;
  border-radius: 0.3rem;
  text-align: center;
  border: 2px solid grey;
  cursor: pointer;

  .img-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: inherit;
  }

  .img-wrapper::before {
    content: '';
    display: block;
    padding-bottom: 56.25%;
  }

  .img-wrapper img {
    position: absolute;
    min-width: 7.5rem;
    max-width: 100%;
    height: 100%;
    width: auto;
    height: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .img-wrapper span {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0.7rem;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 1.8rem;
    justify-content: center;
    word-break: keep-all;
    line-height: 1.3;
  }

  label {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

interface Props {
  loading?: boolean;
  label?: string;
  content?: string;
  onChange: (attechment: File) => void;
}

const InferenceImage = ({ label, content, loading, onChange }: Props) => {
  const [source, setSource] = useState<string>(content ?? '');

  const handleFileChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!(e.target.files && e.target?.files.length)) return;
      const file = e.target.files[0];
      const source = await blobToBase64(file);

      setSource(typeof source === 'string' ? source : String(source));
      onChange(file);
    },
    [onChange]
  );

  useEffect(() => {
    if (!content) return;
    setSource(content);
  }, [content]);

  return (
    <InferenceImageStyle>
      <div className="img-wrapper">
        {source ? <img src={source} alt={label ?? ''} /> : <span>{label}</span>}
      </div>
      <label>
        <input
          className="sr-only"
          type="file"
          accept="image/*"
          disabled={loading}
          onChange={handleFileChange}
        />
      </label>
    </InferenceImageStyle>
  );
};

export default InferenceImage;
