import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class RestApiService {
  
  // Define API
  apiURL = 'http://localhost:5000';
  userID = "5d73a631dc1280680445b763";

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
      retry(0),
      catchError(this.handleError)
    )  
  }
  
  uploadCatalogFiles(formData: any) {
    return this.http.post<any[]>(this.apiURL + '/upload-catalog-resumes', formData)
    .pipe(
      retry(0),
      catchError(this.handleError)
    )  
  }

  catalogQualifications(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-qualification', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError)
    )  
  }

  catalogSkills(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-skills', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError)
    )  
  }
  
  catalogFiles(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/get-catalog-files', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError)
    )  
  }

  catalogMatchedProfiles(userId: string, catalogName: string, minExp: number, maxExp: number, qualifications: any[], 
    req_skills: any[], opt_skills: any[]) {
    return this.http.post<any[]>(this.apiURL + '/short-list-profiles', 
      JSON.stringify({"user_id": userId, "catalog": catalogName, "min_exp": minExp, "max_exp": maxExp, 
      "req_skills": req_skills, "opt_skills": opt_skills, "qualifications": qualifications}), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError)
    )  
  }

  extractFileData(userId: string, catalogName: string) {
    return this.http.post<any[]>(this.apiURL + '/extract-catalog-resumes-data', 
      JSON.stringify({"user_id": userId, "catalog": catalogName}), this.httpOptions)
    .pipe(
      retry(0),
      catchError(this.handleError)
    )  
  }
   
  // downloadResume(userId: string, catalog_id: string, file_id: string) {
  //   return this.http.post<any[]>(this.apiURL + '/download-resume', 
  //     JSON.stringify({"user_id": userId, "catalog_id": catalog_id, "file_id": file_id}), this.httpOptions)
  //   .pipe(
  //     retry(0),
  //     catchError(this.handleError)
  //   )  
  // }

  // downloadResume(userId: string, catalogName: string, file_id: string) {
  //   return this.http.get<any[]>(this.apiURL + '/download-resume?' + 
  //     "user_id=" + userId + "&" + "catalog=" + catalogName + "&" + "file_id=" + file_id)
  //   .pipe(
  //     retry(0),
  //     catchError(this.handleError)
  //   )  
  // }
  // // HttpClient API post() method => Create employee
  // createEmployee(employee): Observable<Employee> {
  //   return this.http.post<Employee>(this.apiURL + '/employees', JSON.stringify(employee), this.httpOptions)
  //   .pipe(
  //     retry(1),
  //     catchError(this.handleError)
  //   )
  // }  

  // // HttpClient API put() method => Update employee
  // updateEmployee(id, employee): Observable<Employee> {
  //   return this.http.put<Employee>(this.apiURL + '/employees/' + id, JSON.stringify(employee), this.httpOptions)
  //   .pipe(
  //     retry(1),
  //     catchError(this.handleError)
  //   )
  // }

  // // HttpClient API delete() method => Delete employee
  // deleteEmployee(id){
  //   return this.http.delete<Employee>(this.apiURL + '/employees/' + id, this.httpOptions)
  //   .pipe(
  //     retry(1),
  //     catchError(this.handleError)
  //   )
  // }

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