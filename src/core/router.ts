export type ViewId = 'lab' | 'aprende' | 'ejemplos' | 'videos' | 'recursos';

const VIEW_IDS: ViewId[] = ['lab', 'aprende', 'ejemplos', 'videos', 'recursos'];

export function isViewId(value: string): value is ViewId {
  return (VIEW_IDS as string[]).includes(value);
}

export interface Route {
  view: ViewId;
  params: URLSearchParams;
}

/** Parse the current hash as a route: `#/view?key=value`. */
export function parseHash(): Route {
  const raw = location.hash.replace(/^#/, '') || '/lab';
  const path = raw.split('?')[0] ?? '';
  const query = raw.split('?')[1] ?? '';
  const view = path.replace(/^\//, '') || 'lab';
  return {
    view: isViewId(view) ? view : 'lab',
    params: new URLSearchParams(query),
  };
}

export function navigate(view: ViewId, params?: Record<string, string>): void {
  const q = params ? `?${new URLSearchParams(params).toString()}` : '';
  location.hash = `/${view}${q}`;
}
