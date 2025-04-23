import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ViewComponent } from './view/view.component';
import { ViewDetailModalComponent } from './view-detail-modal/view-detail-modal.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DashboardService } from './dashboard.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from "../../shared/services/NgbDateCustomParserFormatter.service";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ViewComponent,
                data: {
                    title: "Dashboard",
                    breadcrumb: "View"
                }
            }
        ]
    }
]

@NgModule({
    imports: [CommonModule, SharedModule, RouterModule.forChild(routes), PdfViewerModule, NgxDatatableModule, NgbModule],
    exports: [RouterModule],
    declarations: [ViewComponent, ViewDetailModalComponent],
    providers: [DashboardService,
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
    ],
})
export class DashboardModule { }
