import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RestApiService } from '../api/rest-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-record',
  templateUrl: './edit-record.component.html',
  styleUrls: ['./edit-record.component.css']
})
export class EditRecordComponent implements OnInit {

  @Input() fileData: {};
  name: string;
  emailIDs: any[] = [];
  mobileNumbers: any[] = [];
  qualifications: any[] = [];
  skills: any[] = [];
  isActive: boolean;

  constructor(private activeModal: NgbActiveModal, private apiService: RestApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.name = this.fileData["Name"];
    this.emailIDs = this.fileData["Email_Address"];
    this.mobileNumbers = this.fileData["Mobile_No"];
    this.skills = this.fileData["Skills"];
    this.qualifications = this.fileData["Degree"];
    this.isActive = this.fileData["is_active"];
  }

  public cancel() {
    this.activeModal.close(false);
  }

  public update() {
    this.apiService.updateCatalogFileData(this.fileData["_id"], this.name, this.emailIDs,
       this.mobileNumbers, this.skills, this.qualifications, this.isActive)
    .subscribe((response)=>{
      if(response["status"] === "success"){
        this.toastr.success(response["message"], '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.activeModal.close(true);
      }else if(response["status"] === "error"){
        this.toastr.error(response["message"], '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      }
    });
  }

  onEmailAdd(event: any){
    this.emailIDs[this.emailIDs.length - 1] = event.value;
  }
  onMobileAdd(event: any){
    this.mobileNumbers[this.mobileNumbers.length - 1] = event.value;
  }
  onSkillAdd(event: any){
    this.skills[this.skills.length - 1] = event.value;
  }
  onQualificationAdd(event: any){
    this.qualifications[this.qualifications.length - 1] = event.value;
  }
}
