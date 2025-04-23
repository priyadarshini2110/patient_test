import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../auth.service';

export const routes: Routes = [
    { path: '', component: LoginComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, SharedModule],
    exports: [],
    declarations: [LoginComponent],
    providers: [AuthService],
})
export class LoginModule { }
