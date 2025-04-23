import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CommonService {
    constructor() { }

    jwt() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser)
        var currToken = currentUser.currentToken;
        console.log(currToken)
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': currToken
        });
        return { headers: httpHeaders };
    }

}