type StrapiImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

type StrapiMeta = {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type StrapiEntry<T extends any> = {
  id: number;
  attributes: T;
};

export type StrapiSingleData<T extends any> = {
  data: StrapiEntry<T>;
};

export type StrapiMultipleData<T extends any> = {
  data: StrapiEntry<T>[];
  meta: StrapiMeta;
};

export type StrapiMedia = {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail: StrapiImageFormat;
    small: StrapiImageFormat;
    medium: StrapiImageFormat;
    large: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  created_at: string;
  updated_at: string;
};
