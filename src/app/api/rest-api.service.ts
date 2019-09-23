import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {
  
  // Define API
  apiURL = 'http://localhost:5000';
  userID = "5d73a631dc1280680445b763"; //ramesh
  // userID = "5d84908958c58f0f23f71220"; //DK
  logged_in = null;
  

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  // HttpClient API get() method => Fetch employees list
  getUserCatalogs(userId: string) {
    return this.http.post<any[]>(this.apiURL + '/user-catalogs', JSON.stringify({"user_id": userId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }
  
  uploadCatalogFiles(formData: any) {
    return this.http.post<any[]>(this.apiURL + '/upload-catalog-resumes', formData)
    .pipe(
      catchError(this.handleError)
    )  
  }

  catalogQualifications(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-qualification', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  catalogSkills(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-skills', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }
  
  catalogFiles(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-files', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  catalogMatchedProfiles(userId: string, catalogName: string, minExp: number, maxExp: number, qualifications: any[], 
    req_skills: any[], opt_skills: any[]) {
    return this.http.post<any[]>(this.apiURL + '/short-list-profiles', 
      JSON.stringify({"user_id": userId, "catalog": catalogName, "min_exp": minExp, "max_exp": maxExp, 
      "req_skills": req_skills, "opt_skills": opt_skills, "qualifications": qualifications}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  extractFileData(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/extract-catalog-resumes-data', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  getUserCatalogDetails(userId: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-details', JSON.stringify({"user_id": userId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  deleteCatalog(userId: string, catalog: string) {
    return this.http.post<any[]>(this.apiURL + '/delete-catalog', JSON.stringify({"user_id": userId, "catalog": catalog}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }

  deleteCatalogFile(userId: string, catalog: string, fileId: string) {
    return this.http.post<any[]>(this.apiURL + '/delete-catalog-file', JSON.stringify({"user_id": userId, "catalog": catalog, "file_id": fileId}), this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )  
  }
   
  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}