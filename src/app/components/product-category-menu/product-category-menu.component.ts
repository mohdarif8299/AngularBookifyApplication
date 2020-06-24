import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {


  producCategories:ProductCategory[] = [];

  constructor(private productService:ProductService) { }

  ngOnInit(): void {
   this.listProductCategories();
  }

  listProductCategories():void {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log("Product Categrories = "+JSON.stringify(data))
        this.producCategories = data;
      }
    )
  }

}
