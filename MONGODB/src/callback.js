const sum = (a, b, callback) => {
    setTimeout(() => {
        if (typeof a !== "number" || typeof b !== "number") {
            return callback("a b must be numbers");
        }
        callback(undefined, a + b);
    }, 3000);
};

const callback = (err, sum) => {
    if (err) return console.log(err);
    console.log(sum);
};

sum(1, "z", callback);
