import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../api/rest-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { EditRecordService } from '../edit-record/edit-record.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-catalogs',
  templateUrl: './my-catalogs.component.html',
  styleUrls: ['./my-catalogs.component.css']
})
export class MyCatalogsComponent implements OnInit {

  public extracting: boolean = false;
  public deleting: boolean = false;
  
  catalogFiles: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  userCatalogs = [];
  selectedCatalog = [];
  catalogSettings = {
    singleSelection: true, 
    text:"Select Catalog",
    enableSearchFilter: true,
    searchPlaceholderText: "Search Catalog"
  };

  constructor(private apiService: RestApiService, private toastr: ToastrService, 
    private confirmationDialogService: ConfirmationDialogService, private editRecord: EditRecordService,
    private router: Router) { }

  ngOnInit() {
    if(!this.apiService.userID){
      this.router.navigate(['login']);
    }else{
      this.userCatalogs = [];
      this.selectedCatalog = [];
      this.catalogFiles = [];
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        responsive: true,
        scrollY: '500',
        scrollX: true
      };
      this.getUserCatalogNames();    
    }
  }

  public getUserCatalogNames(){
    this.apiService.getUserCatalogs().subscribe((response)=>{
      if(response["status"] == "success"){
        for(let cat_index in response["data"]){
          response["data"][cat_index]["id"] = cat_index + 2;
          response["data"][cat_index]["itemName"] = response["data"][cat_index]["name"];
          this.userCatalogs.push(response["data"][cat_index]);
        }
      }else if(response["status"] == "error"){
        this.toastr.error("Unable to get catalog names", '', {
          timeOut: 1500,
          progressBar: true,
          closeButton: true
        });
      }
    });
  }

  public getCatalogFiles(){
    this.catalogFiles = [];
    if(this.selectedCatalog.length){
      this.apiService.catalogFiles(this.selectedCatalog[0]["_id"])
        .subscribe((response)=>{
          if(response["status"] === "success"){
            this.catalogFiles = response["files"];
          }else if(response["status"] === "error"){
            this.toastr.error("Unable to get catalog files", '', {
              timeOut: 1500,
              progressBar: true,
              closeButton: true
            });
          }
        });
      this.dtTrigger.next();
    }
  }

  onCatalogSelect() {
    this.getCatalogFiles();
  }
  onCatalogDeSelect() {
    this.getCatalogFiles();
  }

  extractFileData(){
    if(this.extracting === false){
      this.extracting = true;
      if(this.selectedCatalog.length){
        this.apiService.extractFileData(this.selectedCatalog[0]["_id"])
          .subscribe((response)=>{
            if(response["status"] === "success"){
              this.toastr.success(response["message"], '', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });
              this.getCatalogFiles();
            }else if(response["status"] === "error"){
              this.toastr.error("Unable to extract data from catalog files", '', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });
            }
            this.extracting = false;
        });
      }
    }
  }

  deleteCatalog(){
    if(this.deleting === false){
      this.deleting = true;
      this.confirmationDialogService.confirm('Confirmation', 'Do you really want to delete this catalog?')
      .then((confirmed) =>{ 
        if(confirmed==true){
          this.apiService.deleteCatalog(this.selectedCatalog[0]["_id"])
          .subscribe((response)=>{
            if(response["status"] === "success"){
              this.toastr.success(response["message"], '', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });
              this.ngOnInit()
            }else if(response["status"] === "error"){
              this.toastr.error("Unable to delete catalog.", '', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });
            }
            this.deleting = false;
          });
        }else{
          this.deleting = false;
        }
      })
      .catch(() => 
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      );
    }
  }

  deleteFile(file_id: string, index: number){
    this.confirmationDialogService.confirm('Confirmation', 'Do you really want to delete this record?')
      .then((confirmed) =>{ 
        if(confirmed==true){
          this.apiService.deleteCatalogFile(this.selectedCatalog[0]["_id"], file_id)
          .subscribe((response)=>{
            if(response["status"] === "success"){
              this.toastr.success(response["message"], '', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });
              this.catalogFiles.splice(index, 1);
            }else if(response["status"] === "error"){
              this.toastr.error("Unable to delete catalog.", '', {
                timeOut: 3000,
                progressBar: true,
                closeButton: true
              });
            }
          });
        }
      })
      .catch(() => 
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      );
  }
  
  editFile(file_data: {}){
    this.editRecord.editRecord(file_data)
      .then((confirmed) =>{ 
        if(confirmed === true){
          this.getCatalogFiles();
        }
      })
      .catch(() => 
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      );
  }
}
