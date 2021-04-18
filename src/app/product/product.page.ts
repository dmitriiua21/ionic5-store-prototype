import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService, IProduct } from '../core';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  public product: IProduct;
  public productForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private api: ApiService) { }

  ngOnInit() {
    this.getCurrentProduct();
    this.setForm();
    this.setFormControlsHandlers();
  }

  setForm() {
    this.productForm = new FormGroup({
      amount: new FormControl(),
      quantity: new FormControl()
    });
  }

  getCurrentProduct() {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = +params['id'];
        this.api.getProduct(id).subscribe(product => this.product = product);
      }
    });
  }

  setFormControlsHandlers() {
    this.productForm.get('amount').valueChanges.subscribe(value => {
      const quantity =  Math.round((value / this.product.price) * 100) / 100 || null;
      this.setFormControlValue('quantity', quantity, false);
    })
    this.productForm.get('quantity').valueChanges.subscribe(value => {
      const amount = Math.round((value * this.product.price)* 100) / 100 || null;
      this.setFormControlValue('amount', amount, false)
    })
  }

  setFormControlValue(control: string, value: number, emit: boolean) {
    this.productForm.get(control).setValue(value, {onlySelf: true, emitEvent: emit});
  }

}
