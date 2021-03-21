const sum = (a, b) => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (typeof a !== 'number' || typeof b !== 'number') {
                reject('a b must be numbers');
            }
            resolve(a + b);
        }, 3000)
    })

sum(10, 20)
    .then((sum1) => sum(sum1, 3))
    .then((sum2) => console.log(sum2))
    .catch((err) => console.log(err))