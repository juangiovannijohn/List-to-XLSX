import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEjemploComponent } from './dialog-ejemplo.component';

describe('DialogEjemploComponent', () => {
  let component: DialogEjemploComponent;
  let fixture: ComponentFixture<DialogEjemploComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEjemploComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEjemploComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
