import { TestBed } from '@angular/core/testing';

import { EditRecordService } from './edit-record.service';

describe('EditRecordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditRecordService = TestBed.get(EditRecordService);
    expect(service).toBeTruthy();
  });
});
