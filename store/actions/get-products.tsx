import qs from "query-string";

import { Product } from "@/types";


interface Query {
	categoryId?:string
	colorId?:string 
	sizeId?:string
	isFeatured?:boolean
}

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProducts = async(
	query:Query
):Promise<Product[]> => {
	const url = qs.stringifyUrl({
		url:URL,
		query:{
			colorId:query.colorId,
			sizeId:query.sizeId,
			isFeatured:query.isFeatured,
			categoryId:query.categoryId, 
		}
	})
	const res = await fetch(url,{
		cache: "no-store",
	});
	return res.json();
}

export default getProducts;