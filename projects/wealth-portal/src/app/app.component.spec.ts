import { TestBed } from '@angular/core/testing';
import { BofaAmountPipe, BofaUiModule } from '@bofa-demo/ui';
import { HoldingsComponent } from './holdings.component';
import { MatTableModule } from '@angular/material/table';

describe('HoldingsComponent (downstream contract with @bofa-demo/ui)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BofaUiModule, MatTableModule],
      declarations: [HoldingsComponent],
    }).compileComponents();
  });

  it('renders design-system components and totals the portfolio', () => {
    const fixture = TestBed.createComponent(HoldingsComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('bofa-page-header')?.textContent).toContain('Portfolio holdings');
    expect(el.querySelectorAll('tr.mat-row').length).toBe(3);
    expect(el.textContent).toContain(new BofaAmountPipe().transform(fixture.componentInstance.total));
  });
});
