import { Injectable } from '@angular/core';
import { gsap } from 'gsap/all';

@Injectable({
    providedIn: 'root'
})



export class GsapService {
    public to(element, vars: any) {
        gsap.to(element, vars);
    }
}