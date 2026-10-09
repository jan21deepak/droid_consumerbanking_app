import { BofaMaskPipe } from './mask.pipe';

describe('BofaMaskPipe', () => {
  const pipe = new BofaMaskPipe();

  it('keeps only the last four digits', () => {
    expect(pipe.transform('4400 1234 5678 9012')).toBe('••••9012');
  });

  it('handles empty values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('does not mask short values', () => {
    expect(pipe.transform('12')).toBe('12');
  });
});
