declare module "masonry-layout" {
  interface MasonryOptions {
    itemSelector?: string;
    columnWidth?: string | number | HTMLElement;
    percentPosition?: boolean;
    gutter?: number;
    [key: string]: any;
  }

  export default class Masonry {
    constructor(element: HTMLElement | string, options?: MasonryOptions);
    layout(): void;
    remove(elements: HTMLElement | HTMLElement[]): void;
    appended(elements: HTMLElement | HTMLElement[]): void;
    reloadItems(): void;
    destroy(): void;
  }
}
