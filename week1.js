// Function checks if a is a perfect square
// Function returns true if a is a perfect square

function isPerfectSquare (a) {
    let num = parseInt(Math.sqrt(a));
    return (num * num == a);
}

// Functio returns true if x is a Fibonacci number

function isFibonacci(x) {
    // x is Fibonnacci if one or both conditions are true
    return isPerfectSquare(5 * x * x + 4) ||
           isPerfectSquare(5 * x * x  - 4);
}
for (let i = 1; i <= 10; i++) {
    if (isFibonacci(i) == true) {
    console.log( i + " is a Fibonacci Number.")
    } else {
        console.log(i + " is not a Fibonacci Number.")
    }
}

isFibonacci(2);

