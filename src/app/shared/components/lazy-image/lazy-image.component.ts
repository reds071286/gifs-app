import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'shared-lazy-Image',
  templateUrl: './lazy-Image.component.html'
})
export class LazyImageComponent {

  @Input()
  public url!: string;

  @Input()
  public alt!: string;

  public hasLoaded: boolean = false;

  constructor() { }

  ngOnInit() {
    if(!this.url) throw new Error('URL property is required');
  }

  onLoad(){
    this.hasLoaded=true;
  }

}
