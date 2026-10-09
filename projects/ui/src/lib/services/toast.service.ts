import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Injectable, Injector } from '@angular/core';
import { BofaToastComponent } from '../components/toast.component';

/** Imperatively renders a toast into document.body (pre-v13 dynamic component pattern). */
@Injectable({ providedIn: 'root' })
export class BofaToastService {
  private ref?: ComponentRef<BofaToastComponent>;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  show(message: string, durationMs = 4000): void {
    this.dismiss();
    const factory = this.resolver.resolveComponentFactory(BofaToastComponent);
    const ref = factory.create(this.injector);
    ref.instance.message = message;
    ref.instance.closed.subscribe(() => this.dismiss());
    this.appRef.attachView(ref.hostView);
    document.body.appendChild(ref.location.nativeElement);
    this.ref = ref;
    setTimeout(() => this.ref === ref && this.dismiss(), durationMs);
  }

  dismiss(): void {
    if (!this.ref) {
      return;
    }
    this.appRef.detachView(this.ref.hostView);
    this.ref.destroy();
    this.ref = undefined;
  }
}
