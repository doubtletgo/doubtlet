// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse<T = any> = Promise<T>;
export type WithMeta = {
  meta: {
    total: number;
    totalPages: number;
  };
  currentPage: number;
};
