import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product:Product = new Product();

  constructor(private productService:ProductService,
    private router:ActivatedRoute) {

     }

  ngOnInit(): void {
    this.router.paramMap.subscribe(()=>{
      this.handleProductList();
    })
  }
  handleProductList() {
    const theProductId :number = +this.router.snapshot.paramMap.get("id");
    this.productService.getProduct(theProductId).subscribe(
      data=>{
        this.product = data;
      }
    )
  }

}
