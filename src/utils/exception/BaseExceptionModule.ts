import { AxiosResponse } from 'axios';

const BaseExceptionModule = class extends Error {
  static match(code?: number | string): boolean {
    return !!(code && code !== '0000');
  }

  public isDev: boolean = import.meta.env.NODE_ENV === 'development';

  constructor(
    public code: number | string,
    message: string,
    public response?: AxiosResponse
  ) {
    super(message);
  }

  public getExceptionMessage() {
    const code = this.code ?? 'none';
    return this.isDev
      ? `(${code}) ${this.message}`
      : `요청 처리에 실패하였습니다. (Error Code: ${code})`;
  }
};

export default BaseExceptionModule;
