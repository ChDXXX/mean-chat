import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatToolComponent } from './chat-tool.component';

describe('ChatToolComponent', () => {
  let component: ChatToolComponent;
  let fixture: ComponentFixture<ChatToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
