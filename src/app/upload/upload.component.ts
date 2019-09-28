import { RestApiService } from '../api/rest-api.service';
import {Component, ViewChild, OnInit} from '@angular/core';
import {NgbTypeahead} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, merge} from 'rxjs/operators';
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
  public loading: boolean = false;
  
  constructor(private apiService: RestApiService, private toastr: ToastrService, private router: Router) {  }

  ngOnInit() {
    if(!this.apiService.userID){
      this.router.navigate(['login']);
    }else{
      this.getUserCatalogNames();
    }
  }

  public selectedCatalog: any;

  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      merge(this.focus$),
      merge(this.click$.pipe(filter(() => !this.instance.isPopupOpen()))),
      map(term => (term === '' ? this.user_catalogs
        : this.user_catalogs.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );

   formatter = (x: {searchitem: string}) => x["name"];

  public getUserCatalogNames(){
    this.apiService.getUserCatalogs().subscribe((response)=>{
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

  public onSelectFile(event: any) {
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
    if(this.loading === false){
      this.loading = true;
      const formData = new FormData();
      Array.from(this.uploadedFiles).forEach(f => formData.append('file', f));
      formData.append('user_id', this.apiService.userID);
      if(typeof(this.selectedCatalog) === 'string'){
        formData.append('catalog_id', null);
        formData.append('catalog_name', this.selectedCatalog);  
      }else{
        formData.append('catalog_id', this.selectedCatalog._id);
        formData.append('catalog_name', this.selectedCatalog.name);  
      }
      this.apiService.uploadCatalogFiles(formData).subscribe((response)=>{
        if(response["status"] == "success"){
          this.toastr.success(response["message"], '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          this.selectedCatalog = [];
          this.uploadedFiles = null;
          this.getUserCatalogNames();       
        }else if(response["status"] == "error"){
          this.toastr.error(response["message"], '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        }
        this.loading = false;
      });
    }
  }
}
