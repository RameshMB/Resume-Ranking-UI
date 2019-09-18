import { RestApiService } from '../api/rest-api.service';
import {Component, ViewChild, OnInit} from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject, merge} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public user_catalogs: any[];
  public uploadedFiles: File[];
  
  constructor(private apiService: RestApiService, private toastr: ToastrService, public router: Router) {  }

  ngOnInit() {
    this.getUserCatalogNames();    
  }

  public selectedCatalog: any;
  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  search = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.user_catalogs
        : this.user_catalogs.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  public getUserCatalogNames(){
    this.apiService.getUserCatalogs(this.apiService.userID).subscribe((response)=>{
      if(response["status"] == "success"){
        this.user_catalogs = response["data"];  
      }else if(response["status"] == "error"){
        this.toastr.error("Unable to get catalog names", '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.router.navigate(['']);
      }
     });
  }

  public onSelectFile(event) {
    var valid_file_type = true;
    for(let sel_file of event.target.files){
        var file_type = sel_file["name"].split(".").pop();      // Split the string using dot as separator
        if(!(file_type == 'txt' || file_type == 'pdf' || file_type == 'docx')){
          this.toastr.error("Upload .txt, .pdf & .docx files only", 'File Type', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          valid_file_type = false;
          break
        }
    }
    if(valid_file_type){
      this.uploadedFiles = event.target.files;
    }
  }

  public onSubmit() {
    const formData = new FormData();
    Array.from(this.uploadedFiles).forEach(f => formData.append('file', f));
    formData.append('user_id', this.apiService.userID);
    formData.append('catalog_name', this.selectedCatalog);
    this.apiService.uploadCatalogFiles(formData).subscribe((response)=>{
      if(response["status"] == "success"){
        this.toastr.success(response["message"], '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.router.navigate(['']);
      }else if(response["status"] == "error"){
        this.toastr.error(response["message"], '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      }
     });
  }
}
