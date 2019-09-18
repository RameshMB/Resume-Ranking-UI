import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../api/rest-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-my-catalogs',
  templateUrl: './my-catalogs.component.html',
  styleUrls: ['./my-catalogs.component.css']
})
export class MyCatalogsComponent implements OnInit {
  
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

  constructor(private apiService: RestApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      scrollY: '200',
      scrollX: true,
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
}
