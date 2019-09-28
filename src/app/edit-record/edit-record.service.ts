import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EditRecordComponent } from './edit-record.component';

@Injectable({
  providedIn: 'root'
})
export class EditRecordService {

  constructor(private modalService: NgbModal) { }

  public editRecord(
    fileData: {},
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(EditRecordComponent, { size: dialogSize });
    modalRef.componentInstance.fileData = fileData;
    return modalRef.result;
  }
}
