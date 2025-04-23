import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/shared/services/common.service';
import { environment } from '../../../environments/environment';
@Injectable()
export class DashboardService {
    baseUrl = environment.serviceApiUrl;

    constructor(private httpClient: HttpClient, private commonService: CommonService) { }

    public getMainData() {
        return this.httpClient.get("assets/data/project-related/main-table.json", this.commonService.jwt());
    }

    public getDetailedData(criteria?:any) {
        if (criteria) {
            return this.httpClient.get(this.baseUrl + "/emsa/custom"+criteria, this.commonService.jwt());

        }else{
            return this.httpClient.get(this.baseUrl + "/emsa/custom", this.commonService.jwt());
        }
    }

    public fetchDashboardMetric(){
        return this.httpClient.get(this.baseUrl + "/emsa/metric-query", this.commonService.jwt());
    }

    public postActions(body) {
        return this.httpClient.post(this.baseUrl + "/emsa/status-update", body, this.commonService.jwt());
    }

    public getPatientDetail(mrn?:string){
        return this.httpClient.get(this.baseUrl + "/emsa/"+mrn, this.commonService.jwt());
    }
}