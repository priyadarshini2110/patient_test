
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NavService, Menu } from '../../services/nav.service';
import { Router } from '@angular/router';

var body = document.getElementsByTagName("body")[0];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menuItems: Menu[];
  public items: Menu[];
  public openNav: boolean = false
  public right_sidebar: boolean = false
  public text: string

  @Output() rightSidebarEvent = new EventEmitter<boolean>();

  constructor(public navServices: NavService, private router: Router) {  }

  ngOnInit() {
    this.navServices.items.subscribe(menuItems => {
      this.items = menuItems
    });
  }

  collapseSidebar() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
