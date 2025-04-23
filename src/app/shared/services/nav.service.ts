import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = true

	constructor() {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			path: '/dashboard', title: 'Dashboard', icon: 'pie-chart', type: 'link', active: true
		},
		// {
		// 	path: '/raise-support', title: 'Raise Support', icon: 'headphones', type: 'link'
		// },
		// {
		// 	path: '/documentation', title: 'Documentation', icon: 'file-text', type: 'link'
		// }
	]
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

}
