// function that checks if a year is leap
function leapYear(year) {
    if ((year % 4 === 0) && (year % 100 != 0) || (year % 400 == 0)) {
        console.log(year + " is a leap year." ); 
    } else {
        console.log(year + " is a leap year."); 
    }
}
leapYear(2014); // is a leep year
