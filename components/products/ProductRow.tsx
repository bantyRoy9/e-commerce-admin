import Image from "next/image";

export default function ProductRow({

product,

}:any){

return(

<tr className="border-b">

<td className="py-4">

<Image

src={product.image}

alt={product.name}

width={70}

height={70}

className="rounded-xl"

/>

</td>

<td>

{product.name}

</td>

<td>

{product.category}

</td>

<td>

₹{product.price}

</td>

<td>

{product.stock}

</td>

<td>

<span

className={`px-3 py-1 rounded-full text-sm

${

product.stock>0

?

"bg-green-100 text-green-700"

:

"bg-red-100 text-red-700"

}

`}

>

{

product.stock>0

?

"In Stock"

:

"Out of Stock"

}

</span>

</td>

<td>

<button className="text-blue-600">

Edit

</button>

<button className="ml-4 text-red-600">

Delete

</button>

</td>

</tr>

)

}