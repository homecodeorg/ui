import { dragCarriesFiles, filesForDrop } from './dropFiles';

describe('dragCarriesFiles', () => {
  test('accepts a Finder file drag', () => {
    expect(dragCarriesFiles(['Files'])).toBe(true);
    expect(dragCarriesFiles(['public.file-url'])).toBe(true);
  });

  test('keeps a drag with hidden types', () => {
    expect(dragCarriesFiles([])).toBe(true);
  });

  test('ignores a text drag', () => {
    expect(dragCarriesFiles(['text/plain'])).toBe(false);
    expect(dragCarriesFiles(null)).toBe(false);
  });
});

describe('filesForDrop', () => {
  const note = new File(['hi'], 'note.txt', { type: 'text/plain' });

  test('uses the files list and does not read items', () => {
    const getAsFile = jest.fn();
    const files = filesForDrop({
      defaultPrevented: false,
      disabled: false,
      accept: '',
      multiple: true,
      dataTransfer: {
        types: ['Files'],
        files: [note],
        items: [{ kind: 'file', getAsFile }],
      },
    });
    expect(files).toEqual([note]);
    expect(getAsFile).not.toHaveBeenCalled();
  });

  test('falls back to items when macOS leaves files empty', () => {
    const files = filesForDrop({
      defaultPrevented: false,
      disabled: false,
      accept: '',
      multiple: true,
      dataTransfer: {
        types: ['public.file-url'],
        files: [],
        items: [{ kind: 'file', getAsFile: () => note }],
      },
    });
    expect(files.map(file => file.name)).toEqual(['note.txt']);
  });

  test('skips a drop another listener already claimed', () => {
    const files = filesForDrop({
      defaultPrevented: true,
      disabled: false,
      accept: '',
      multiple: true,
      dataTransfer: { types: ['Files'], files: [note] },
    });
    expect(files).toEqual([]);
  });

  test('filters with accept', () => {
    const image = new File(['img'], 'pic.png', { type: 'image/png' });
    const files = filesForDrop({
      defaultPrevented: false,
      disabled: false,
      accept: '.txt',
      multiple: true,
      dataTransfer: { types: ['Files'], files: [image, note] },
    });
    expect(files).toEqual([note]);
  });
});
