import { Component, Input, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewDetailModalComponent } from '../view-detail-modal/view-detail-modal.component';
import { DashboardService } from '../dashboard.service';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  dashBoardArray: any = [];

  buttonFilters = [
    { name: "All", color: "info" },
    { name: "Arrived", color: "info" },
    { name: "Open", color: "info" },
    { name: "Completed", color: "info" },
    { name: "Last 24 hours", color: "info" }

  ];

  resultButtons = [
    { code: "accept-patient-transfer", name: "Accept Patient Transfer", color: "success" },
    { code: "patient-diverted", name: "Patient Diverted", color: "danger" },
    { code: "transmit-to-pulsecheck", name: "Transmit to Pulsecheck", color: "info" },
    { code: "bed-waiting", name: "Bed Waiting", color: "warning" }
  ];

  tableColumns = ["SELECT", "ID/MRN", "TIME", "NAME", "DOB", "ADDRESS", "SMMC STATUS", "STATUS", "ACTION"];

  public data: any = [];
  public sortedData: any = [];
  public selected: any = [];
  public selectedItemList: any = [];

  isFirstTime = true;

  ColumnMode = ColumnMode;
  selectionType: SelectionType

  selectedDate: any;
  today = this.calendar.getToday();
  searchString = "";

  a03count = 0;
  issuesCount = 0;

  page = 0;
  pageSize = 7;


  constructor(private modalService: NgbModal, private service: DashboardService, private calendar: NgbCalendar) {
  }

  ngOnInit(): void {
    this.getDashboardMetric();
    this.getData();
  }

  setData(serviceData){
    this.data = this.manageStyle(serviceData);
    this.sortedData = this.data;
  }

  getData() {
    this.service.getDetailedData()
      .subscribe(arg => {
        this.setData(arg);
      }, error => {
        console.log(error)
      });
  }

  getDashboardMetric() {
    this.service.fetchDashboardMetric()
      .subscribe(arg => { 
        this.dashBoardArray = arg
        // console.log(this.dashBoardArray)
      });
  }
  

  textSearch() {
    // console.log(this.data)
    // console.log(this.sortedData) 
    // console.log(this.searchString)  
    // console.log(this.searchString.toLowerCase())  
    this.sortedData = this.data.filter(s =>
        ((s.patientName.toLowerCase().includes(this.searchString.toLowerCase()))
      || (s.admitdateTimeId.toLowerCase().includes(this.searchString.toLowerCase()))
      || (s.mrn.toLowerCase().includes(this.searchString.toLowerCase()))));
  }


  manageStyle(data: any) {
    data.forEach(element => {
      element = this.manageStyleForDischarged(element);
      if (element.status == null || element.status == "") { this.issuesCount = this.issuesCount + 1 }
      element.isSelected = "N";
      switch (element.smmcStatus) {
        case "Accept Patient Transfer":
          element.color = "success";
          break;
        case "Transmit to Pulsecheck":
          element.color = "info";
          break;
        case "Patient Diverted":
          element.color = "danger";
          break;
        case "Bed Waiting":
          element.color = "warning";
          break;
        default:
          break;
      }
      if(element.status == 'Discharged'){
        element.color = "warning";
        element.smmcStatus = "-";
      }
    });
    console.log(this.a03count)
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this.updatingCountForDischarged();
    }
    return data;
  }

  manageStyleForDischarged(element) {
    if (element.messageTypeEvent == "A03") {
      this.a03count = this.a03count + 1;
      element.status = "Discharged";
      return element;
    } else {
      return element;
    }
  }
  updatingCountForDischarged() {
    console.log(this.dashBoardArray)
    this.dashBoardArray.forEach(x => {
     
      // if (x.type == "Issues") {
      //   x.count = this.issuesCount + "";
      // }
    });
  }
  // ----------------------------------------------------------------

  // onSelect(item) {
  //   console.log(item)
  //   this.selected.push(item);
  // }

  removeItem(array, item){ 
      const idx = array.indexOf(item); 
      if (idx > -1) {  
        var newArray=[]; 
        array.forEach(element => {
          if(element!==item){
            newArray.push(element);
          }
        });
        array = newArray;
      }  
      return array;
  }
  onSelect(event, msgId){ 
    if(msgId==null || msgId==""|| msgId=="0"){
      alert("Bad Data - MessageId is empty")
      return false;
    }
    if(event.target.checked){ 
      const idx = this.selected.indexOf(msgId); 
      if (idx == -1) {
        this.selected.push(msgId);
      }
    }
    else{
      const idx = this.selected.indexOf(msgId); 
      if (idx > -1) { 
        this.selected = this.removeItem(this.selected,msgId); 
      }
       
    } 
  }

  // findColor(_status){
  //   var _color = "";
  //   var _array = this.resultButtons.filter(function (x){
  //     return x.name == _status;
  //   })
  //   return _array[0].color;
  // }

  updateRequests = [];
  handleActions(item) {
    //fetch Items for selected msgIds
    this.selectedItemList = [];
    this.sortedData.forEach(element => {
      if(this.selected.indexOf(element.msgId)>-1){
        this.selectedItemList.push(element);
      }
    });

    this.updateRequests = [];
    this.selectedItemList.forEach(element => {
      let request = { mrnId: element.mrn, msgId:element.msgId, smmcStatus: item.name ,status: element.status }
      this.updateRequests.push(request);
      element.smmcStatus = item.name;
      element.color = item.color;     

      if(item.name == "Accept Patient Transfer"){
        element.status = "Open";
      }
      else if(item.name == "Bed Waiting" ||item.name == "Transmit to Pulsecheck"){
        element.status = "Arrived";
      }
      else if(item.name == "Patient Diverted"){
        element.status = "Closed";
      }
    });
    console.log(this.selectedItemList)
    console.log(this.updateRequests)
    this.selected = [];
    this.selectedItemList = [];
    this.service.postActions(this.updateRequests)
      .subscribe(arg => {
        this.selected = arg;
        this.selected = [];
        // this.getData();
      });
  }

  onMetricSelect(item) {
    var criteria = "?actionMetrics=" + item.type;
    this.service.getDetailedData(criteria)
      .subscribe(arg => this.setData(arg));
  }

  onButtonSelect(item) {
    
    //clearing other filters
    this.selectedDate = ''; 
    this.searchString = '';

    var criteria = "?actionButtons=" + item.name;
    this.service.getDetailedData(criteria)
      .subscribe(arg => this.setData(arg));
  }

  onDateSelect() {
    console.log(this.selectedDate)
    var dt = this.selectedDate.year + "-" + this.concatZeroIfNeeded(this.selectedDate.month) + "-" + this.concatZeroIfNeeded(this.selectedDate.day);
    var criteria = "?byDateTime=" + dt;
    this.service.getDetailedData(criteria)
      .subscribe(arg => this.setData(arg));
  }

  concatZeroIfNeeded(inputMonthValue) {
    if (inputMonthValue <= 9) {
      return inputMonthValue = "0" + inputMonthValue;
    } else {
      return inputMonthValue;
    }
  }

  openModal(item) {
    // console.log(item);
    // console.log(item.mrn);
    const modalRef = this.modalService.open(ViewDetailModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.name = 'World';
    modalRef.componentInstance.mrn = item.mrn;
  }

}
