import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../dashboard.service';

const base64abc = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
    "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/"
];

@Component({
    selector: 'view-detail-modal',
    templateUrl: 'view-detail-modal.component.html',
    styleUrls: ['./view-detail-modal.component.scss']
})
export class ViewDetailModalComponent implements OnInit {
    @Input() name;
    @Input() mrn;
    patient:any;

  page = 0;
  pageSize = 11;
    rows = [
        { time: "08:45 am", bp: "200/100", resp: "40", o2: "90" },
        { time: "09:45 am", bp: "210/100", resp: "45", o2: "92" }
    ];

    pdfActions = [
        { action: "zoom-in", name: "Zoom In", icon: "zoom-in" },
        { action: "zoom-out", name: "Zoom Out", icon: "zoom-out" }
    ];

    finalImage;

    // pdf config
    pageVariable = 1;
    zoom = 0.5;
    pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

    // Config for tiff
    tiffImage = "assets/images/project-related/G4.tiff";
    tiffImageUrl = "https://file-examples-com.github.io/uploads/2017/10/file_example_TIFF_1MB.tiff"

    canvas;
    ctx;
    constructor(public activeModal: NgbActiveModal, private service: DashboardService) { }

    public handlingActions(item) {
        switch (item.action) {
            case "zoom-in":
                this.zoom = this.zoom + 0.1
                break;
            case "zoom-out":
                if (this.zoom == 0.5) {
                    console.log("Reached maximum")
                } else {
                    this.zoom = this.zoom - 0.1
                }
                break;
            default:
                break;
        }
    }

    UTIF = require('utif');

    ngOnInit() {
        this.sendRes();
        window.onload = () =>{
            this.canvas = document.getElementById('viewcanvas') as HTMLCanvasElement; 
            this.ctx = this.canvas.getContext('2d');
        }
        console.log("mrn-"+this.mrn)   
        this.service.getPatientDetail(this.mrn)
                    .subscribe(patient => { 
                        console.log(patient)
                        this.patient = null;
                        this.patient = patient;
                    });

    }

    // Functions related to Tiff
    public sendRes() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.tiffImage);
        xhr.responseType = "arraybuffer";
        xhr.onload = (e: any) => {
            console.log(e)
            var ifds = this.UTIF.decode(e.target.response);
            this.UTIF.decodeImage(e.target.response, ifds[0])
            var rgba = this.UTIF.toRGBA8(ifds[0]);  // Uint8Array with RGBA pixels
            console.log(ifds[0].width, ifds[0].height, ifds[0]);
            console.log(rgba);
            this.finalImage = rgba;
            this.putImage(rgba,ifds[0].width, ifds[0].height);
        }
        xhr.send();
    }

    putImage(rgba, width, height) {
        var imageData = rgba; //ctx.getImageData(55, 50, 200, 100);
        // this.ctx.putImageData(imageData, 0, 0);
        this.ctx.drawImage(imageData, 100, 100);
    }

}