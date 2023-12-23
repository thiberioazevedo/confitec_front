import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users?: any[];

    constructor(private accountService: AccountService, private alertService: AlertService) {}

    ngOnInit() {
        this.accountService.getAll()
        .pipe(map(val => { 
            return (<any>val).data
        }))
        .subscribe(val => { 
            this.users = val;
        })
    }

    deleteUser(id: number) {
        const user = this.users!.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.users = this.users!.filter(x => x.id !== id);
                    user.isDeleting = false;
                },
                error: error => {
                    this.alertService.error(error);
                    user.isDeleting = false;
                }
            });             
    }
}