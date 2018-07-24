var result = "Invoice #: 0000118<br>, Payment Status : Paid<br>, PO #: 0001148941<br>, Vendor: DEBBIE SIEGEL CONSULTING LLC<br>, Invoice Amount: 7000<br>and Invoice Status : APPROVED<br>|Payment|Invoice|Run Report|Exit";

result = result.replace(/,/g, "");
console.log(result);
var result_arr = result.split("|");
if (result_arr.length > 1) {
    console.log('add buttons');
} else {
    console.log('Just Emit');
}