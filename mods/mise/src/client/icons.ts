// Hand-drawn 24px line icons, stroked with currentColor.
const svg = (body: string, extra = '') => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${body}</svg>`;

export const icon = {
  pin: svg('<path d="M9 3.5h6l-.8 5.2 3.3 3.3v1.8h-11V12l3.3-3.3z"/><path d="M12 13.8V20.5"/>'),
  pinFilled: svg('<path d="M9 3.5h6l-.8 5.2 3.3 3.3v1.8h-11V12l3.3-3.3z" fill="currentColor"/><path d="M12 13.8V20.5"/>'),
  refresh: svg('<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4.5H15"/>'),
  branch: svg('<circle cx="6.5" cy="5.5" r="2"/><circle cx="6.5" cy="18.5" r="2"/><circle cx="17.5" cy="7.5" r="2"/><path d="M6.5 7.5v9"/><path d="M17.5 9.5c0 4-3.5 5-11 7"/>'),
  shield: svg('<path d="M12 3.2 19.5 6v5.6c0 4.6-3.2 7.9-7.5 9.2-4.3-1.3-7.5-4.6-7.5-9.2V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'),
  search: svg('<circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/>'),
  chevron: svg('<path d="m9.5 6 6 6-6 6"/>'),
  alert: svg('<path d="M12 4 21.5 20h-19z"/><path d="M12 10.5v4"/><path d="M12 17.5h.01"/>'),
  x: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  terminal: svg('<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="m7.5 10 3 2.5-3 2.5"/><path d="M12.5 15.5h4"/>'),
  box: svg('<path d="M12 3.2 20 7.6v8.8L12 20.8 4 16.4V7.6z"/><path d="M4 7.6 12 12l8-4.4"/><path d="M12 12v8.8"/>'),
  layers: svg('<path d="m12 3.5 9 4.7-9 4.7-9-4.7z"/><path d="m3 12.4 9 4.7 9-4.7"/><path d="m3 16.4 9 4.7 9-4.7" opacity=".55"/>'),
  folder: svg('<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2v7.8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>'),
  open: svg('<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14v4a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18V8a1.5 1.5 0 0 1 1.5-1.5h4"/>'),
  knife: svg('<path d="M20.5 3.5c.9 3.4-1.1 7-4.6 10.4l-2.6-2.6"/><path d="m13.3 11.3 7.2-7.8"/><path d="m12.1 12.5-7.6 7.6a1.5 1.5 0 0 1-2.1-2.1L10 10.4"/><path d="m10 10.4 2.1 2.1"/>'),
};
