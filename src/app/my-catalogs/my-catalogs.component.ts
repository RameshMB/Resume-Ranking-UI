import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../api/rest-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';



@Component({
  selector: 'app-my-catalogs',
  templateUrl: './my-catalogs.component.html',
  styleUrls: ['./my-catalogs.component.css']
})
export class MyCatalogsComponent implements OnInit {

  public extracting: boolean = false;
  public deleting: boolean = false;
  
  catalogFiles: any[];
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

  constructor(private apiService: RestApiService, private toastr: ToastrService, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
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

  public getUserCatalogNames(){
    this.apiService.getUserCatalogs(this.apiService.userID).subscribe((response)=>{
      if(response["status"] == "success"){
        for(let cat_index in response["data"]){
          this.userCatalogs.push({"id": cat_index + 2, "itemName": response["data"][cat_index]});
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
      this.apiService.catalogFiles(this.apiService.userID, this.selectedCatalog[0]["itemName"])
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

  onCatalogSelect(item: any) {
    console.log(item);
    this.getCatalogFiles();
  }
  onCatalogDeSelect(items: any) {
    console.log(items);
    this.getCatalogFiles();
  }

  extractFileData(){
    if(this.extracting === false){
      this.extracting = true;
      if(this.selectedCatalog.length){
        this.apiService.extractFileData(this.apiService.userID, this.selectedCatalog[0]["itemName"])
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
          this.apiService.deleteCatalog(this.apiService.userID, this.selectedCatalog[0]["itemName"])
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

  deleteFile(file_id, index){
    this.confirmationDialogService.confirm('Confirmation', 'Do you really want to delete this record?')
      .then((confirmed) =>{ 
        if(confirmed==true){
          this.apiService.deleteCatalogFile(this.apiService.userID, this.selectedCatalog[0]["itemName"], file_id)
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
  
  editFile(file_id, index){
    console.log(file_id, index);
  }
}
