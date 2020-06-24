import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[];
  currentCategoryId:number;
  previousCategoryId:number=1;
  currentCategoryName: string;
  searchMode:boolean;

  thePageNumber:number=1;
  thePagSize:number=4;
  thCurrentCatgegory:number=1;
  theTotalElements:number;

  previousKeyword:string = null;


  constructor(private productService:ProductService,
    private route:ActivatedRoute,private cartSrvice:CartService
    ) {

   }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    })
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {

    const theKeyword:string = this.route.snapshot.paramMap.get('keyword');
    
    if(this.previousKeyword!=theKeyword) {
      this.thePageNumber= 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`previousKeyword=${this.previousKeyword}`+`keyword=${theKeyword}`);


    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                                this.thePagSize,
                                                theKeyword).subscribe(this.processResult())

  }
  handleListProducts(){
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
 
      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name');
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if(this.previousCategoryId!=this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`theCurrentCatgoryId = ${this.currentCategoryId},thPageNumber=${this.thePageNumber}`);



    this.productService.getProductListPaginate(
                                                this.thePageNumber-1,
                                                this.thePagSize,
                                                this.currentCategoryId
                                                ).subscribe(this.processResult())
  }
  processResult() {
    return data=>{
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number+1;
      this.thePagSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
  updatePageSize(pagSize:number){
    this.thePagSize = pagSize;
    this.thePageNumber = 1;
    this.listProducts();

  }
  addToCart(theProduct:Product){
    console.log(`Adding to cart ${theProduct.name}, ${theProduct.imageUrl} `);
    const cartItem = new CartItem(theProduct);
    this.cartSrvice.addToCart(cartItem);
  }
}
