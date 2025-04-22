import Polly from 'aws-sdk/clients/polly';

const polly = new Polly({
  region: 'ap-northeast-2', // Replace with your desired AWS region
  accessKeyId: import.meta.env.VITE_POLLY_ID, // Replace with your AWS access key ID
  secretAccessKey: import.meta.env.VITE_POLLY_KEY, // Replace with your AWS secret access key
});

const generateCustomSSML = (str: string): string => {
  const koreanNumbers: { [key: string]: string } = {
    '0': '영',
    '1': '한',
    '2': '두',
    '3': '세',
    '4': '네',
    '5': '다섯',
    '6': '여섯',
    '7': '일곱',
    '8': '여덟',
    '9': '아홉',
    '10': '열',
    '11': '열한',
    '12': '열두',
    '13': '열세',
    '14': '열네',
    '15': '열다섯',
    '16': '열여섯',
    '17': '열일곱',
    '18': '열여덟',
    '19': '열아홉',
    '20': '스무',
  };

  return str
    .replace(/(\d+~\d+)(장|개|조각)/g, (substr, numbers, unit) => {
      const [num1, num2] = numbers.split('~');

      if (!num1 || !num2) return `${numbers} ${unit}`;

      return `${koreanNumbers[num1]}에서 ${koreanNumbers[num2]} ${unit}`;
    })
    .replace(/(\d+)(장|개|조각)/g, (substr, number, unit) => {
      if (!koreanNumbers[number]) {
        return `${number} ${unit}`;
      }

      const koreanNumber = koreanNumbers[number] || number;
      return `${koreanNumber} ${unit}`;
    });
};

function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

async function synthesizeSpeech(
  text: string,
  outputFormat: string = 'mp3'
): Promise<ArrayBuffer> {
  const params = {
    Text: `<speak><prosody volume='x-loud' rate='110%'><amazon:effect name='drc'><![CDATA[${generateCustomSSML(
      text.replace(/[\b]/g, '')
    )}]]>
    </amazon:effect></prosody></speak>`,
    OutputFormat: outputFormat,
    VoiceId: 'Seoyeon',
    Engine: 'neural',
    TextType: 'ssml',
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();
    return toArrayBuffer(data.AudioStream as Buffer);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
}

export { synthesizeSpeech };
