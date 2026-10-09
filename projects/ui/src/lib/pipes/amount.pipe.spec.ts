import { BofaAmountPipe } from './amount.pipe';

describe('BofaAmountPipe', () => {
  const pipe = new BofaAmountPipe();

  it('formats positive amounts as USD', () => {
    expect(pipe.transform(1234.5)).toBe('$1,234.50');
  });

  it('formats negative amounts with a leading minus', () => {
    expect(pipe.transform(-42)).toBe('-$42.00');
  });

  it('optionally shows a plus sign', () => {
    expect(pipe.transform(10, true)).toBe('+$10.00');
  });

  it('renders an em dash for missing values', () => {
    expect(pipe.transform(null)).toBe('—');
  });
});
