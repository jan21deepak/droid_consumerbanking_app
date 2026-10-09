import { TestBed } from '@angular/core/testing';
import { DbsAmountPipe, DbsUiModule } from '@dbs-demo/ui';
import { HoldingsComponent } from './holdings.component';
import { MatTableModule } from '@angular/material/table';

describe('HoldingsComponent (downstream contract with @dbs-demo/ui)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbsUiModule, MatTableModule],
      declarations: [HoldingsComponent],
    }).compileComponents();
  });

  it('renders design-system components and totals the portfolio', () => {
    const fixture = TestBed.createComponent(HoldingsComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('dbs-page-header')?.textContent).toContain('Portfolio holdings');
    expect(el.querySelectorAll('tr.mat-row').length).toBe(3);
    expect(el.textContent).toContain(new DbsAmountPipe().transform(fixture.componentInstance.total));
  });
});
