exports.handler = async (event) => {
    const category=event.category;
    const productNameArray=event.PhoneN_product_name;
    const productCategory=event.PhoneN_product_Category;

    let possibleproduct=[];
    for(let i=0;i<productCategory.length;i++)
    {
        if(category==productCategory[i])
        {
            possibleproduct.push(productNameArray[i]);
        }
    }

    const result={
        possibleproduct:possibleproduct
    }
    return result;
}